import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const code = req.nextUrl.searchParams.get("code");
  const requestedNext = req.nextUrl.searchParams.get("next") ?? "/dashboard";
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//") && !requestedNext.includes("\\")
      ? requestedNext
      : "/dashboard";

  if (!isSupabaseConfigured() || !code) {
    const url = new URL("/login", origin);
    url.searchParams.set("error", "El enlace de acceso no es válido o ya venció. Pedí uno nuevo.");
    return NextResponse.redirect(url, { status: 303 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const url = new URL("/login", origin);
    url.searchParams.set("error", "El enlace de acceso no es válido o ya venció. Pedí uno nuevo.");
    return NextResponse.redirect(url, { status: 303 });
  }

  const { error: orgError } = await supabase.rpc("create_organization_with_owner", {
    org_name: String(data.user?.user_metadata?.organization_name ?? "Mi organización").slice(0, 120),
  });
  if (orgError) {
    const url = new URL("/login", origin);
    url.searchParams.set("error", "Tu sesión se abrió, pero no se pudo preparar la organización. Volvé a intentar.");
    return NextResponse.redirect(url, { status: 303 });
  }

  return NextResponse.redirect(new URL(next, origin), { status: 303 });
}
