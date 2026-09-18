import { PageHeader } from "@/components/app/PageHeader";
import { StrategyWizard } from "@/components/app/StrategyWizard";
import { getOrgContext } from "@/lib/supabase/org";

export default async function PreciosPage() {
  const ctx = await getOrgContext();
  const org = ctx
    ? await ctx.supabase.from("organizations").select("name").eq("id", ctx.orgId).maybeSingle()
    : null;

  return (
    <>
      <PageHeader
        title="Precios y rentabilidad"
        description="Parte del mismo recorrido de estrategia: estructura de precios, márgenes y rentabilidad por canal."
      />
      <div className="flex flex-col gap-6 p-8">
        <StrategyWizard initialAreaId="precios" organizationName={org?.data?.name ?? ""} />
      </div>
    </>
  );
}
