import { PageHeader } from "@/components/app/PageHeader";
import { StrategyWizard } from "@/components/app/StrategyWizard";
import { getOrgContext } from "@/lib/supabase/org";

export default async function IcpPage() {
  const ctx = await getOrgContext();
  const org = ctx
    ? await ctx.supabase.from("organizations").select("name").eq("id", ctx.orgId).maybeSingle()
    : null;

  return (
    <>
      <PageHeader
        title="Cliente ideal · ICP"
        description="Parte del mismo recorrido de estrategia: a quién le vendés y cómo se segmentan tus comercios objetivo."
      />
      <div className="flex flex-col gap-6 p-8">
        <StrategyWizard initialAreaId="icp" organizationName={org?.data?.name ?? ""} />
      </div>
    </>
  );
}
