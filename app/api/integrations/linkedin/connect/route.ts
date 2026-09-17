import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

export async function GET(req: NextRequest) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri =
    process.env.LINKEDIN_REDIRECT_URI ??
    `${req.nextUrl.origin}/api/integrations/linkedin/callback`;

  if (!clientId) {
    const url = new URL("/configuracion/integraciones", req.url);
    url.searchParams.set(
      "linkedin_error",
      "Falta LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET. Creá una app en https://www.linkedin.com/developers/apps y configurá las variables de entorno.",
    );
    return NextResponse.redirect(url);
  }

  const state = randomBytes(16).toString("hex");
  const scope = process.env.LINKEDIN_SCOPES ?? "openid profile email w_member_social";

  const authorizeUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("scope", scope);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set("li_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
  });
  return response;
}
