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
  const requestedNext = String(form.get("next") ?? "/dashboard");
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//") && !requestedNext.includes("\\")
      ? requestedNext
      : "/dashboard";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  const url = new URL("/login", origin);
  if (error) {
    url.searchParams.set("error", error.message);
  } else {
    url.searchParams.set(
      "notice",
      "Lanzamos tu acceso a producción: revisá tu email y hacé un clic en el enlace para entrar sin contraseña.",
    );
  }
  return NextResponse.redirect(url, { status: 303 });
}
