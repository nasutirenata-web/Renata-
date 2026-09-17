import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { getSkillTool } from "@/lib/skills-registry";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

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
          "Falta configurar ANTHROPIC_API_KEY en el servidor. Podés escribir el contenido a mano y guardarlo igual.",
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

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2000,
      system: skillContent,
      messages: [
        {
          role: "user",
          content: `Datos aportados por el usuario para esta tarea:\n\n${inputsText || "(sin datos adicionales — usá las reglas por defecto de la skill)"}\n\nGenerá el resultado siguiendo exactamente el workflow y las reglas de la skill.`,
        },
      ],
    });

    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ result: text });
  } catch (error) {
    const description = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json(
      { error: "provider_error", message: `Anthropic devolvió un error: ${description}` },
      { status: 502 },
    );
  }
}
