import { requireAIUser } from "@/lib/api-auth";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `Sos un analista comercial que propone HIPÓTESIS de tipos de negocio para
investigar manualmente, en el contexto de venta B2B a comercios y puntos de venta. No tenés
acceso a ninguna base de datos real: generás perfiles de negocio plausibles para la zona y el
segmento pedidos, cada uno con una razón breve de por qué encajaría. Dejá explícito que son
hipótesis para investigar, nunca datos verificados. No inventes direcciones, teléfonos ni
información de contacto.

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
  const segmento = typeof body?.segmento === "string" ? body.segmento.trim() : "";
  const zona = typeof body?.zona === "string" ? body.zona.trim() : "";
  const tamano = typeof body?.tamano === "string" ? body.tamano.trim() : "";
  const rol = typeof body?.rol === "string" ? body.rol.trim() : "";
  const origen = body?.origen === "inbound" ? "inbound" : "outbound";

  if (!segmento && !zona && !tamano && !rol) {
    return NextResponse.json(
      { error: "Completá al menos uno de los criterios de búsqueda." },
      { status: 400 },
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `Segmento: ${segmento || "(sin especificar)"}\nZona: ${zona || "(sin especificar)"}\nTamaño estimado: ${tamano || "(sin especificar)"}\nRol de contacto buscado: ${rol || "(sin especificar)"}\nOrigen: ${origen === "inbound" ? "Inbound (ya mostró interés)" : "Outbound (prospección en frío)"}`,
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
