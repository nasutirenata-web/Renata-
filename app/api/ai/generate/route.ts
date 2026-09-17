import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { getSkillTool } from "@/lib/skills-registry";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  const body = await req.json().catch(() => null);
  if (!body || typeof body.slug !== "string" || typeof body.inputs !== "object") {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const tool = getSkillTool(body.slug);
  if (!tool) {
    return NextResponse.json({ error: "Herramienta desconocida." }, { status: 404 });
  }

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Falta configurar GEMINI_API_KEY en el servidor. Podés escribir el contenido a mano y guardarlo igual.",
      },
      { status: 501 },
    );
  }

  let skillContent: string;
  try {
    skillContent = await readFile(path.join(process.cwd(), "lib", "skills", tool.file), "utf-8");
  } catch {
    return NextResponse.json({ error: "No se pudo leer la skill." }, { status: 500 });
  }

  const inputsText = Object.entries(body.inputs as Record<string, string>)
    .filter(([, value]) => value && value.trim().length > 0)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n\n");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `Datos aportados por el usuario para esta tarea:\n\n${inputsText || "(sin datos adicionales — usá las reglas por defecto de la skill)"}\n\nGenerá el resultado siguiendo exactamente el workflow y las reglas de la skill.`,
      system_instruction: skillContent,
    });

    return NextResponse.json({ result: interaction.output_text });
  } catch (error) {
    const description = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json(
      { error: "provider_error", message: `Gemini devolvió un error: ${description}` },
      { status: 502 },
    );
  }
}
