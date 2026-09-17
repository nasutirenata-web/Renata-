import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const origin = req.nextUrl.origin;

  if (!isSupabaseConfigured()) {
    const url = new URL("/login", origin);
    url.searchParams.set("error", "Supabase no está configurado todavía. Revisá Configuración → Integraciones.");
    return NextResponse.redirect(url, { status: 303 });
  }

  const form = await req.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const requestedNext = String(form.get("next") ?? "/dashboard");
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") && !requestedNext.includes("\\") ? requestedNext : "/dashboard";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const url = new URL("/login", origin);
    url.searchParams.set("error", error.message);
    return NextResponse.redirect(url, { status: 303 });
  }

  const { error: orgError } = await supabase.rpc("create_organization_with_owner", {
    org_name: String(data.user?.user_metadata?.organization_name ?? "Mi organización").slice(0, 120),
  });
  if (orgError) {
    const url = new URL("/login", origin);
    url.searchParams.set("error", "Tu sesión está iniciada, pero no se pudo preparar la organización. Volvé a intentar.");
    return NextResponse.redirect(url, { status: 303 });
  }
  return NextResponse.redirect(new URL(next || "/dashboard", origin), { status: 303 });
}
