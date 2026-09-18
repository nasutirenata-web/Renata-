import { requireAIUser } from "@/lib/api-auth";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { allSteps } from "@/lib/strategy-steps";

function buildSystemPrompt() {
  const outline = allSteps
    .map(
      ({ key, section }) =>
        `- "${key}": {${section.fields.map((f) => `"${f.name}": "..."`).join(", ")}}`,
    )
    .join("\n");

  return `Sos un consultor de estrategia comercial B2B. A partir de una descripción breve del
negocio que te da el usuario, redactá un borrador COMPLETO de su estrategia comercial, cubriendo
exactamente las claves y campos indicados abajo. Sé específico y concreto según lo que el usuario
describió — no genérico, no relleno vacío. Si el usuario no dio información suficiente para algún
campo, hacé una suposición razonable y explícita (ej: "Asumiendo un ticket medio, dado que no se
especificó...").

Respondé ÚNICAMENTE con JSON válido, sin texto adicional ni bloques de código, con esta forma
exacta (un objeto por cada clave de sección, con sus campos en texto):
{
${outline}
}`;
}

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
        message: "Falta configurar GEMINI_API_KEY en el servidor para generar la estrategia.",
      },
      { status: 501 },
    );
  }

  const body = await req.json().catch(() => null);
  const descripcion = typeof body?.descripcion === "string" ? body.descripcion.trim() : "";
  if (!descripcion) {
    return NextResponse.json({ error: "Contanos brevemente de qué trata el negocio." }, { status: 400 });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `Descripción del negocio: ${descripcion}`,
      system_instruction: buildSystemPrompt(),
    });

    const parsed = extractJson(interaction.output_text ?? "");
    if (!parsed || typeof parsed !== "object") {
      return NextResponse.json(
        { error: "provider_error", message: "Gemini no devolvió un borrador válido." },
        { status: 502 },
      );
    }

    const sections: Record<string, Record<string, string>> = {};
    for (const { key, section } of allSteps) {
      const raw = parsed[key];
      if (!raw || typeof raw !== "object") continue;
      const values: Record<string, string> = {};
      for (const field of section.fields) {
        const v = raw[field.name];
        if (typeof v === "string" && v.trim()) values[field.name] = v.trim();
      }
      if (Object.keys(values).length > 0) sections[key] = values;
    }

    if (Object.keys(sections).length === 0) {
      return NextResponse.json(
        { error: "provider_error", message: "Gemini no completó ningún campo reconocible." },
        { status: 502 },
      );
    }

    return NextResponse.json({ sections });
  } catch (error) {
    const description = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json(
      { error: "provider_error", message: `Gemini devolvió un error: ${description}` },
      { status: 502 },
    );
  }
}
