import { PageHeader, OriginTabs } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
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
        <div className="grid grid-cols-1 gap-4 overflow-x-auto pb-4 sm:grid-cols-2 lg:grid-cols-5">
          {stages.map((stage) => (
            <div
              key={stage.key}
              className="glass-panel flex min-h-[280px] flex-col rounded-3xl p-4"
            >
              <div className="flex items-center justify-between px-1">
                <p className="text-sm font-medium text-foreground">{stage.label}</p>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">0</span>
              </div>
              <div className="mt-4 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-surface-border/80 text-xs text-muted-2">
                Sin oportunidades
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-2">
          Una oportunidad solo avanza de etapa cuando alguien la mueve. Conectá
          Supabase en Configuración para que estos cambios queden guardados.
        </p>
      </div>
    </>
  );
}
