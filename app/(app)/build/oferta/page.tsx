import { PageHeader } from "@/components/app/PageHeader";
import { StrategyWizard } from "@/components/app/StrategyWizard";
import { getOrgContext } from "@/lib/supabase/org";

export default async function OfertaPage() {
  const ctx = await getOrgContext();
  const org = ctx
    ? await ctx.supabase.from("organizations").select("name").eq("id", ctx.orgId).maybeSingle()
    : null;

  return (
    <>
      <PageHeader
        title="Oferta y catálogo"
        description="Parte del mismo recorrido de estrategia: la propuesta comercial para el cliente B2B y su presentación."
      />
      <div className="flex flex-col gap-6 p-8">
        <StrategyWizard initialAreaId="oferta" organizationName={org?.data?.name ?? ""} />
      </div>
    </>
  );
}
