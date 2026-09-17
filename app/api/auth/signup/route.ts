import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { randomMarketingCode } from "@/lib/marketing-words";

export async function POST(req: NextRequest) {
  const origin = req.nextUrl.origin;

  if (!isSupabaseConfigured()) {
    const url = new URL("/signup", origin);
    url.searchParams.set("error", "Supabase no está configurado todavía. Revisá Configuración → Integraciones.");
    return NextResponse.redirect(url, { status: 303 });
  }

  const form = await req.formData();
  const email = String(form.get("email") ?? "");
  const fullName = String(form.get("full_name") ?? "");
  const organizationName = String(form.get("organization_name") ?? "Mi organización");
  const passwordMode = String(form.get("password_mode") ?? "generated");

  const generatedPassword = randomMarketingCode();
  const password = passwordMode === "custom" ? String(form.get("password") ?? "") : generatedPassword;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        organization_name: organizationName,
        ...(passwordMode === "generated" ? { login_word: generatedPassword } : {}),
      },
    },
  });

  if (error) {
    const url = new URL("/signup", origin);
    url.searchParams.set("error", error.message);
    return NextResponse.redirect(url, { status: 303 });
  }

  if (data.session) {
    const { error: orgError } = await supabase.rpc("create_organization_with_owner", {
      org_name: organizationName,
    });
    if (orgError) {
      const url = new URL("/signup", origin);
      url.searchParams.set("error", `Cuenta creada, pero falló la organización: ${orgError.message}`);
      return NextResponse.redirect(url, { status: 303 });
    }
  }

  if (passwordMode === "generated") {
    const res = NextResponse.redirect(new URL("/signup/success", origin), { status: 303 });
    res.cookies.set("signup_word", generatedPassword, {
      httpOnly: true,
      maxAge: 300,
      path: "/signup/success",
      sameSite: "lax",
    });
    return res;
  }

  if (!data.session) {
    const url = new URL("/login", origin);
    url.searchParams.set(
      "notice",
      "Te enviamos un email de confirmación. Confirmá tu cuenta y después iniciá sesión.",
    );
    return NextResponse.redirect(url, { status: 303 });
  }

  return NextResponse.redirect(new URL("/dashboard", origin), { status: 303 });
}
