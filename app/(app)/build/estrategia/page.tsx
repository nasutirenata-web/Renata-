import { PageHeader } from "@/components/app/PageHeader";
import { StrategyWizard } from "@/components/app/StrategyWizard";
import { getOrgContext } from "@/lib/supabase/org";

export default async function EstrategiaPage() {
  const ctx = await getOrgContext();
  const org = ctx
    ? await ctx.supabase.from("organizations").select("name").eq("id", ctx.orgId).maybeSingle()
    : null;

  return (
    <>
      <PageHeader
        title="Estrategia B2B"
        description="Un solo recorrido guiado: estrategia, cliente ideal, oferta, precios y canales, con un PDF al final."
      />
      <div className="flex flex-col gap-6 p-8">
        <StrategyWizard initialAreaId="estrategia" organizationName={org?.data?.name ?? ""} />
      </div>
    </>
  );
}
