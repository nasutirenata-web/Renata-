import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase no está configurado todavía. Revisá Configuración → Integraciones." },
      { status: 400 },
    );
  }

  const { email, token, next: rawNext } = await req.json();
  const requestedNext = String(rawNext ?? "/dashboard");
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//") && !requestedNext.includes("\\")
      ? requestedNext
      : "/dashboard";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email: String(email ?? ""),
    token: String(token ?? "").trim(),
    type: "email",
  });

  if (error) {
    return NextResponse.json({ error: "Código inválido o vencido. Pedí uno nuevo." }, { status: 400 });
  }

  const { error: orgError } = await supabase.rpc("create_organization_with_owner", {
    org_name: String(data.user?.user_metadata?.organization_name ?? "Mi organización").slice(0, 120),
  });
  if (orgError) {
    return NextResponse.json(
      { error: "Tu sesión se abrió, pero no se pudo preparar la organización. Volvé a intentar." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, next });
}
