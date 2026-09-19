import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { parseProfileForm } from "@/lib/profile";

export async function POST(req: NextRequest) {
  const origin = req.nextUrl.origin;

  if (!isSupabaseConfigured()) {
    const url = new URL("/signup", origin);
    url.searchParams.set("error", "Supabase no está configurado todavía. Revisá Configuración → Integraciones.");
    return NextResponse.redirect(url, { status: 303 });
  }

  const form = await req.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const profile = parseProfileForm(form);
  if (profile.error !== null) {
    const url = new URL("/signup", origin);
    url.searchParams.set("error", profile.error);
    return NextResponse.redirect(url, { status: 303 });
  }
  const { organizationName, metadata } = profile;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { ...metadata, organization_name: organizationName } },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      const url = new URL("/login", origin);
      url.searchParams.set("notice", "Ese email ya tiene una cuenta. Iniciá sesión con tu contraseña.");
      url.searchParams.set("email", email);
      return NextResponse.redirect(url, { status: 303 });
    }
    const url = new URL("/signup", origin);
    url.searchParams.set("error", error.message);
    return NextResponse.redirect(url, { status: 303 });
  }

  if (!data.session) {
    const url = new URL("/login", origin);
    url.searchParams.set(
      "notice",
      "Te enviamos un email de confirmación. Confirmá tu cuenta y después iniciá sesión.",
    );
    return NextResponse.redirect(url, { status: 303 });
  }

  const { error: orgError } = await supabase.rpc("create_organization_with_owner", {
    org_name: organizationName,
  });

  if (orgError) {
    const url = new URL("/signup", origin);
    url.searchParams.set("error", `Cuenta creada, pero falló la organización: ${orgError.message}`);
    return NextResponse.redirect(url, { status: 303 });
  }

  return NextResponse.redirect(new URL("/dashboard", origin), { status: 303 });
}
