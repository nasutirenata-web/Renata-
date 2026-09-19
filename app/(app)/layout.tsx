import { AppShell } from "@/components/app/AppShell";
import { getOrgContext } from "@/lib/supabase/org";

export default async function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getOrgContext();
  const org = ctx ? await ctx.supabase.from("organizations").select("name").eq("id", ctx.orgId).maybeSingle() : null;
  const meta = ctx?.user.user_metadata as { full_name?: string; avatar_url?: string } | undefined;
  return (
    <AppShell hasSession={Boolean(ctx)} organizationName={org?.data?.name} userName={meta?.full_name?.trim() || undefined} avatarUrl={meta?.avatar_url || null}>
      {children}
    </AppShell>
  );
}
