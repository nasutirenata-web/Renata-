import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { randomMarketingCode } from "@/lib/marketing-words";

export async function POST(req: NextRequest) {
  const origin = req.nextUrl.origin;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase no está configurado todavía. Revisá Configuración → Integraciones." },
      { status: 400 },
    );
  }

  const { email, next: rawNext } = await req.json();
  const requestedNext = String(rawNext ?? "/dashboard");
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//") && !requestedNext.includes("\\")
      ? requestedNext
      : "/dashboard";

  const supabase = await createClient();
  const code = randomMarketingCode();

  const { error: wordError } = await supabase.rpc("set_login_word", {
    p_email: String(email ?? ""),
    p_word: code,
  });
  if (wordError) {
    return NextResponse.json({ error: wordError.message }, { status: 400 });
  }

  // Sent purely as delivery: the numeric token this generates is ignored,
  // the Magic Link template shows {{ .Data.login_word }} instead.
  const { error } = await supabase.auth.signInWithOtp({
    email: String(email ?? ""),
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
