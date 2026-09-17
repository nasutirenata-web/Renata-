import { AppShell } from "@/components/app/AppShell";
import { getOrgContext } from "@/lib/supabase/org";

export default async function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getOrgContext();
  const org = ctx ? await ctx.supabase.from("organizations").select("name").eq("id", ctx.orgId).maybeSingle() : null;
  return <AppShell hasSession={Boolean(ctx)} organizationName={org?.data?.name}>{children}</AppShell>;
}
