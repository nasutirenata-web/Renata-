import { geminiErrorMessage } from "@/lib/gemini-errors";
import { requireAIUser } from "@/lib/api-auth";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

type AspectRatio = "1:1" | "4:5" | "16:9" | "9:16";

export async function POST(req: NextRequest) {
  const denied = await requireAIUser();
  if (denied) return denied;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "not_configured",
        message: "Falta configurar GEMINI_API_KEY en el servidor para generar imágenes con IA.",
      },
      { status: 501 },
    );
  }

  const body = await req.json().catch(() => null);
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  const aspectRatio: AspectRatio = body?.aspectRatio ?? "1:1";

  if (!prompt) {
    return NextResponse.json({ error: "Falta describir la idea de la imagen." }, { status: 400 });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.1-flash-image",
      input: `Imagen para una publicación de LinkedIn B2B, estilo profesional, marca "Capsule GTM" con vidrio translúcido y reflejos turquesa y violeta sobre un fondo suave y claro. Respetá la dirección visual específica del usuario si pide otros colores o estilo. ${prompt}`,
      response_format: {
        type: "image",
        mime_type: "image/jpeg",
        aspect_ratio: aspectRatio,
        image_size: "1K",
      },
    });

    const image = interaction.output_image;
    if (!image?.data) {
      return NextResponse.json({ error: "Gemini no devolvió una imagen." }, { status: 502 });
    }

    return NextResponse.json({ dataUrl: `data:image/jpeg;base64,${image.data}` });
  } catch (error) {
    return NextResponse.json(
      { error: "provider_error", message: geminiErrorMessage(error, "imágenes") },
      { status: 502 },
    );
  }
}
