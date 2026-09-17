import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = req.cookies.get("li_oauth_state")?.value;
  const settingsUrl = new URL("/configuracion/integraciones", req.url);

  if (!code || !state || state !== storedState) {
    settingsUrl.searchParams.set(
      "linkedin_error",
      "No se pudo validar la respuesta de LinkedIn (state inválido o falta el código).",
    );
    return NextResponse.redirect(settingsUrl);
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri =
    process.env.LINKEDIN_REDIRECT_URI ?? `${url.origin}/api/integrations/linkedin/callback`;

  if (!clientId || !clientSecret) {
    settingsUrl.searchParams.set("linkedin_error", "Faltan credenciales de LinkedIn en el servidor.");
    return NextResponse.redirect(settingsUrl);
  }

  try {
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenRes.ok) {
      const detail = await tokenRes.text();
      settingsUrl.searchParams.set("linkedin_error", `LinkedIn rechazó el intercambio de token: ${detail}`);
      return NextResponse.redirect(settingsUrl);
    }

    // TODO: una vez conectado Supabase, guardar el access_token cifrado
    // en la tabla `integrations`, ligado a la organización del usuario actual.
    // Por ahora no persistimos el token: solo confirmamos que el intercambio funcionó.
    settingsUrl.searchParams.set("linkedin_connected", "1");
    const response = NextResponse.redirect(settingsUrl);
    response.cookies.delete("li_oauth_state");
    return response;
  } catch (error) {
    const description = error instanceof Error ? error.message : "Error desconocido.";
    settingsUrl.searchParams.set("linkedin_error", description);
    return NextResponse.redirect(settingsUrl);
  }
}
