import { cache } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

// cache: el layout y la página piden lo mismo en un pedido; así se consulta a Supabase una sola vez.
export const getOrgContext = cache(async () => {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("memberships")
    .select("organization_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) return null;

  return { supabase, user, orgId: membership.organization_id as string };
});
