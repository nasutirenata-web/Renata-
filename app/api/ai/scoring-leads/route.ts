import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";

const OUTPUT_INSTRUCTIONS = `

Además de tu análisis, siempre respondé ÚNICAMENTE con JSON válido (sin texto adicional, sin
bloques de código), con esta forma exacta:
{"leads": [{"nombre": "...", "empresa": "...", "cargo": "...", "score_total": 0-100, "temperatura": "cold"|"warm"|"hot", "accion": "..."}]}
Donde "temperatura" es "hot" si score_total > 70, "warm" si está entre 40 y 70, y "cold" si es
menor a 40. "accion" es una frase corta con el siguiente paso recomendado para ese lead.`;

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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "not_configured",
        message: "Falta configurar GEMINI_API_KEY en el servidor para puntuar leads.",
      },
      { status: 501 },
    );
  }

  const body = await req.json().catch(() => null);
  const icp = typeof body?.icp === "string" ? body.icp.trim() : "";
  const leads = typeof body?.leads === "string" ? body.leads.trim() : "";

  if (!leads) {
    return NextResponse.json({ error: "Falta la lista de leads." }, { status: 400 });
  }

  let skillContent: string;
  try {
    skillContent = await readFile(
      path.join(process.cwd(), "lib", "skills", "cualificacion-scoring-leads.md"),
      "utf-8",
    );
  } catch {
    return NextResponse.json({ error: "No se pudo leer la skill." }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `ICP de referencia: ${icp || "(no provisto)"}\n\nLista de leads:\n${leads}`,
      system_instruction: skillContent + OUTPUT_INSTRUCTIONS,
    });

    const parsed = extractJson(interaction.output_text ?? "");
    const scoredLeads = Array.isArray(parsed?.leads) ? parsed.leads : [];

    if (scoredLeads.length === 0) {
      return NextResponse.json(
        { error: "provider_error", message: "Gemini no devolvió una lista válida." },
        { status: 502 },
      );
    }

    return NextResponse.json({ leads: scoredLeads });
  } catch (error) {
    const description = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json(
      { error: "provider_error", message: `Gemini devolvió un error: ${description}` },
      { status: 502 },
    );
  }
}
