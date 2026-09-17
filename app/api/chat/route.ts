import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `Eres el asistente de Capsule GTM, el sistema de Go-to-Market B2B construido para Varowa
(distribución a farmacias y comercios). Ayudás con estrategia comercial, CRM, prospección
(email y WhatsApp), scoring de leads, contenido y objeciones de venta. Sé concreto y breve.
Si no tenés datos reales de la cuenta del usuario (porque Supabase todavía no está conectado),
decilo explícitamente en vez de inventar cifras, contactos o resultados.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "not_configured",
        message: "Falta configurar ANTHROPIC_API_KEY en el servidor para activar el chat.",
      },
      { status: 501 },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: body.messages,
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ message: text });
  } catch (error) {
    const description = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json(
      { error: "provider_error", message: `Anthropic devolvió un error: ${description}` },
      { status: 502 },
    );
  }
}
