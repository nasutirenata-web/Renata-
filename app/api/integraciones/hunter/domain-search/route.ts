import { NextRequest, NextResponse } from "next/server";
import { hunterDomainSearch, isHunterConfigured } from "@/lib/integrations/hunter";

export async function POST(req: NextRequest) {
  if (!isHunterConfigured()) {
    return NextResponse.json(
      { message: "Hunter.io no está conectado. Configurá HUNTER_API_KEY en Integraciones." },
      { status: 400 },
    );
  }

  const { domain } = await req.json().catch(() => ({ domain: "" }));
  const cleanDomain = String(domain ?? "").trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

  if (!cleanDomain) {
    return NextResponse.json({ message: "Falta el dominio a buscar." }, { status: 400 });
  }

  try {
    const result = await hunterDomainSearch(cleanDomain);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "No se pudo buscar en Hunter.io." },
      { status: 502 },
    );
  }
}
