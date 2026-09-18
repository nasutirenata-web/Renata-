import { PageHeader, OriginTabs } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { PipelineAccordion, type PipelineDeal } from "@/components/crm/PipelineAccordion";
import { getOrgContext } from "@/lib/supabase/org";
import { Plus } from "lucide-react";

const stages = [
  { key: "contacto", label: "Primer contacto" },
  { key: "interes", label: "Interés" },
  { key: "reunion", label: "Reunión" },
  { key: "pedido", label: "Primer pedido" },
  { key: "cliente", label: "Cliente activo" },
];

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ origen?: string }>;
}) {
  const { origen } = await searchParams;
  const active = origen === "inbound" ? "inbound" : "outbound";

  const ctx = await getOrgContext();
  const deals = ctx
    ? (
        await ctx.supabase
          .from("deals")
          .select("id, stage, title, value_estimate")
          .eq("organization_id", ctx.orgId)
          .eq("origin", active)
          .order("created_at", { ascending: false })
      ).data ?? []
    : [];

  const stagesWithDeals = stages.map((stage) => ({
    ...stage,
    deals: deals
      .filter((d) => d.stage === stage.key)
      .map((d): PipelineDeal => ({
        id: d.id,
        title: d.title,
        value_estimate: d.value_estimate == null ? null : Number(d.value_estimate),
      })),
  }));

  return (
    <>
      <PageHeader
        title="Pipeline"
        description="De primer contacto a primer pedido, por origen."
        action={
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nueva oportunidad
          </Button>
        }
      />
      <div className="flex flex-col gap-6 p-8">
        <OriginTabs active={active} />
        <PipelineAccordion stages={stagesWithDeals} />
        <p className="text-xs text-muted-2">
          Una oportunidad solo avanza de etapa cuando alguien la mueve. Conectá
          Supabase en Configuración para que estos cambios queden guardados.
        </p>
      </div>
    </>
  );
}
