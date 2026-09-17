import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

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
