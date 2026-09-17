import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const origin = req.nextUrl.origin;

  if (!isSupabaseConfigured()) {
    const url = new URL("/forgot-password", origin);
    url.searchParams.set("error", "Supabase no está configurado todavía. Revisá Configuración → Integraciones.");
    return NextResponse.redirect(url, { status: 303 });
  }

  const form = await req.formData();
  const email = String(form.get("email") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/callback?next=/reset-password`,
  });

  if (error) {
    const url = new URL("/forgot-password", origin);
    url.searchParams.set("error", error.message);
    return NextResponse.redirect(url, { status: 303 });
  }

  const url = new URL("/login", origin);
  url.searchParams.set(
    "notice",
    "Si ese email tiene una cuenta, te enviamos un link para restablecer la contraseña.",
  );
  return NextResponse.redirect(url, { status: 303 });
}
