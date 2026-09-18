"use server";

import { getOrgContext } from "@/lib/supabase/org";
import { createAdminClient } from "@/lib/supabase/admin";

// Los mensajes de equipo viven en chat_messages, dentro de una conversación
// compartida por organización con este título; el autor va en `role` como "member:<id>".
const TEAM_TITLE = "Equipo";
const AUTHOR_PREFIX = "member:";

export type TeamMessage = {
  id: string;
  body: string;
  createdAt: string;
  authorName: string;
  mine: boolean;
};

async function findConversationId(ctx: NonNullable<Awaited<ReturnType<typeof getOrgContext>>>) {
  const { data } = await ctx.supabase
    .from("chat_conversations")
    .select("id")
    .eq("organization_id", ctx.orgId)
    .eq("title", TEAM_TITLE)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data?.id ?? null;
}

export async function listTeamMessages(): Promise<{ error: string | null; messages: TeamMessage[] }> {
  const ctx = await getOrgContext();
  if (!ctx) return { error: "No hay sesión activa u organización.", messages: [] };

  const conversationId = await findConversationId(ctx);
  if (!conversationId) return { error: null, messages: [] };

  const { data, error } = await ctx.supabase
    .from("chat_messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .like("role", AUTHOR_PREFIX + "%")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return { error: error.message, messages: [] };

  const rows = (data ?? []).reverse();
  const authorIds = Array.from(new Set(rows.map((r) => r.role.slice(AUTHOR_PREFIX.length))));

  const { data: members } = await ctx.supabase
    .from("memberships")
    .select("user_id")
    .eq("organization_id", ctx.orgId);
  const memberIds = new Set((members ?? []).map((m) => m.user_id));

  const admin = createAdminClient();
  const names = new Map<string, string>();
  await Promise.all(
    authorIds.filter((id) => memberIds.has(id)).map(async (id) => {
      const { data: u } = await admin.auth.admin.getUserById(id);
      const meta = u?.user?.user_metadata as { full_name?: string } | undefined;
      names.set(id, meta?.full_name?.trim() || u?.user?.email?.split("@")[0] || "Integrante");
    }),
  );

  return {
    error: null,
    messages: rows.map((r) => {
      const authorId = r.role.slice(AUTHOR_PREFIX.length);
      return {
        id: r.id,
        body: r.content,
        createdAt: r.created_at,
        authorName: names.get(authorId) ?? "Integrante",
        mine: authorId === ctx.user.id,
      };
    }),
  };
}

export async function sendTeamMessage(body: string): Promise<{ error: string | null }> {
  const ctx = await getOrgContext();
  if (!ctx) return { error: "No hay sesión activa u organización." };

  const text = body.trim();
  if (!text) return { error: "Escribí un mensaje." };
  if (text.length > 2000) return { error: "El mensaje es demasiado largo (máximo 2000 caracteres)." };

  let conversationId = await findConversationId(ctx);
  if (!conversationId) {
    const { data, error } = await ctx.supabase
      .from("chat_conversations")
      .insert({ organization_id: ctx.orgId, user_id: ctx.user.id, title: TEAM_TITLE })
      .select("id")
      .single();
    if (error) return { error: error.message };
    conversationId = data.id;
  }

  const { error } = await ctx.supabase.from("chat_messages").insert({
    conversation_id: conversationId,
    role: AUTHOR_PREFIX + ctx.user.id,
    content: text,
  });
  if (error) return { error: error.message };

  return { error: null };
}
