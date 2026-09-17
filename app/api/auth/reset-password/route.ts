import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const origin = req.nextUrl.origin;

  if (!isSupabaseConfigured()) {
    const url = new URL("/reset-password", origin);
    url.searchParams.set("error", "Supabase no está configurado todavía. Revisá Configuración → Integraciones.");
    return NextResponse.redirect(url, { status: 303 });
  }

  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const confirmPassword = String(form.get("confirm_password") ?? "");

  if (password.length < 6) {
    const url = new URL("/reset-password", origin);
    url.searchParams.set("error", "La contraseña tiene que tener al menos 6 caracteres.");
    return NextResponse.redirect(url, { status: 303 });
  }

  if (password !== confirmPassword) {
    const url = new URL("/reset-password", origin);
    url.searchParams.set("error", "Las contraseñas no coinciden.");
    return NextResponse.redirect(url, { status: 303 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = new URL("/forgot-password", origin);
    url.searchParams.set("error", "El link para restablecer la contraseña no es válido o ya venció. Pedí uno nuevo.");
    return NextResponse.redirect(url, { status: 303 });
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    const url = new URL("/reset-password", origin);
    url.searchParams.set("error", error.message);
    return NextResponse.redirect(url, { status: 303 });
  }

  const url = new URL("/login", origin);
  url.searchParams.set("notice", "Tu contraseña se actualizó. Iniciá sesión con la nueva.");
  return NextResponse.redirect(url, { status: 303 });
}
