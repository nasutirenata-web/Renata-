import { requireAIUser } from "@/lib/api-auth";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `Sos un analista comercial que propone HIPÓTESIS de tipos de negocio para
investigar manualmente, en el contexto de venta B2B. No tenés acceso a ninguna base de datos
real: generás perfiles de negocio plausibles combinando TODOS los criterios que te pasen
(segmento, zona, tamaño, puesto, seniority, industria, tecnología, señal de compra, origen),
cada uno con una razón breve de por qué encajaría según esos criterios. Cuantos más criterios
te den, más específica e informada tiene que ser cada hipótesis — no la ignores. Dejá explícito
que son hipótesis para investigar, nunca datos verificados. No inventes direcciones, teléfonos,
nombres de personas reales ni información de contacto.

Respondé ÚNICAMENTE con JSON válido, sin texto adicional ni bloques de código, con esta forma
exacta: {"prospectos": [{"nombre_hipotetico": "...", "razon": "..."}]}. Generá entre 5 y 8
elementos.`;

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAIUser();
  if (denied) return denied;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "not_configured",
        message: "Falta configurar GEMINI_API_KEY en el servidor para sugerir prospectos.",
      },
      { status: 501 },
    );
  }

  const body = await req.json().catch(() => null);
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const segmento = str(body?.segmento);
  const zona = str(body?.zona);
  const tamano = str(body?.tamano);
  const rol = str(body?.rol);
  const seniority = str(body?.seniority);
  const industria = str(body?.industria);
  const tecnologia = str(body?.tecnologia);
  const senal = str(body?.senal);
  const origen = body?.origen === "inbound" ? "inbound" : "outbound";

  if (!segmento && !zona && !tamano && !rol && !seniority && !industria && !tecnologia && !senal) {
    return NextResponse.json(
      { error: "Completá al menos uno de los criterios de búsqueda." },
      { status: 400 },
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: [
        `Segmento / tipo de negocio: ${segmento || "(sin especificar)"}`,
        `Zona: ${zona || "(sin especificar)"}`,
        `Tamaño de empresa estimado: ${tamano || "(sin especificar)"}`,
        `Puesto del contacto buscado: ${rol || "(sin especificar)"}`,
        `Seniority / nivel: ${seniority || "(sin especificar)"}`,
        `Industria / sector: ${industria || "(sin especificar)"}`,
        `Tecnología o herramientas que usarían: ${tecnologia || "(sin especificar)"}`,
        `Señal / motivo para contactar ahora: ${senal || "(sin especificar)"}`,
        `Origen: ${origen === "inbound" ? "Inbound (ya mostró interés)" : "Outbound (prospección en frío)"}`,
      ].join("\n"),
      system_instruction: SYSTEM_PROMPT,
    });

    const parsed = extractJson(interaction.output_text ?? "");
    const prospectos = Array.isArray(parsed?.prospectos) ? parsed.prospectos : [];

    if (prospectos.length === 0) {
      return NextResponse.json(
        { error: "provider_error", message: "Gemini no devolvió una lista válida." },
        { status: 502 },
      );
    }

    return NextResponse.json({ prospectos });
  } catch (error) {
    const description = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json(
      { error: "provider_error", message: `Gemini devolvió un error: ${description}` },
      { status: 502 },
    );
  }
}
