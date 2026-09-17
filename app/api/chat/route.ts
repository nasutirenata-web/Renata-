import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `Eres el asistente de Capsule GTM, el sistema de Go-to-Market B2B construido para Varowa
(distribución a farmacias y comercios).

Alcance: respondés ÚNICAMENTE preguntas de marketing, estrategia comercial B2B, ventas,
prospección (email/WhatsApp/LinkedIn), CRM, pricing, contenido y las herramientas del
Studio de Capsule GTM. Si te preguntan algo fuera de ese alcance (temas personales,
código, noticias generales, etc.), decilo con amabilidad y redirigí la conversación
hacia marketing/GTM.

Sé concreto y breve. Si no tenés datos reales de la cuenta del usuario (porque Supabase
todavía no está conectado), decilo explícitamente en vez de inventar cifras, contactos
o resultados.`;

type ChatTurn = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "not_configured",
        message: "Falta configurar GEMINI_API_KEY en el servidor para activar el chat.",
      },
      { status: 501 },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const messages = body.messages as ChatTurn[];
  const ai = new GoogleGenAI({ apiKey });

  const conversation = messages
    .map((m) => `${m.role === "assistant" ? "Asistente" : "Usuario"}: ${m.content}`)
    .join("\n\n");

  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: conversation,
      system_instruction: SYSTEM_PROMPT,
    });

    return NextResponse.json({ message: interaction.output_text });
  } catch (error) {
    const description = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json(
      { error: "provider_error", message: `Gemini devolvió un error: ${description}` },
      { status: 502 },
    );
  }
}
