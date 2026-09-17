import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured() || !isAdminConfigured()) {
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
  const cleanEmail = String(email ?? "");
  const cleanWord = String(token ?? "").trim().toUpperCase();

  const supabase = await createClient();

  const { data: userId, error: consumeError } = await supabase.rpc("consume_login_word", {
    p_email: cleanEmail,
    p_word: cleanWord,
  });

  if (consumeError || !userId) {
    return NextResponse.json({ error: "Código inválido o vencido. Pedí uno nuevo." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: cleanEmail,
  });

  if (linkError || !linkData?.properties?.hashed_token) {
    return NextResponse.json({ error: "No pudimos abrir tu sesión. Probá de nuevo." }, { status: 400 });
  }

  const { data, error: verifyError } = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token_hash: linkData.properties.hashed_token,
    type: "magiclink",
  });

  if (verifyError) {
    return NextResponse.json({ error: "No pudimos abrir tu sesión. Probá de nuevo." }, { status: 400 });
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
