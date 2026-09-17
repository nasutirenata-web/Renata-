import { PageHeader, OriginTabs } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Building2, Plus } from "lucide-react";

export default async function EmpresasPage({
  searchParams,
}: {
  searchParams: Promise<{ origen?: string }>;
}) {
  const { origen } = await searchParams;
  const active = origen === "inbound" ? "inbound" : "outbound";

  return (
    <>
      <PageHeader
        title="Empresas"
        description="Farmacias, comercios y cuentas B2B segmentadas por origen."
        action={
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nueva empresa
          </Button>
        }
      />
      <div className="flex flex-col gap-6 p-8">
        <OriginTabs active={active} />
        <EmptyState
          icon={Building2}
          title={`Todavía no hay empresas de ${active === "outbound" ? "Outbound" : "Inbound"}`}
          body="Conectá Supabase para persistir empresas reales, o cargá la primera manualmente para empezar a probar el CRM."
          action={
            <Button size="sm" variant="secondary">
              <Plus className="h-4 w-4" /> Cargar la primera empresa
            </Button>
          }
        />
      </div>
    </>
  );
}
