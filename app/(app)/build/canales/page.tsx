import { PageHeader } from "@/components/app/PageHeader";
import { StrategyWizard } from "@/components/app/StrategyWizard";
import { getOrgContext } from "@/lib/supabase/org";

export default async function CanalesPage() {
  const ctx = await getOrgContext();
  const org = ctx
    ? await ctx.supabase.from("organizations").select("name").eq("id", ctx.orgId).maybeSingle()
    : null;

  return (
    <>
      <PageHeader
        title="Canales"
        description="Parte del mismo recorrido de estrategia: contacto por email y WhatsApp, y canales de venta."
      />
      <div className="flex flex-col gap-6 p-8">
        <StrategyWizard initialAreaId="canales" organizationName={org?.data?.name ?? ""} />
      </div>
    </>
  );
}
