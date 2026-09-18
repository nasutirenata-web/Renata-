import { PageHeader } from "@/components/app/PageHeader";
import { AdvancedProspectSearch } from "@/components/prospeccion/AdvancedProspectSearch";

export default function ProspeccionAvanzadaPage() {
  return (
    <>
      <PageHeader
        title="Búsqueda avanzada"
        description="Filtros por puesto, empresa, ubicación, sector y señal de compra — para cuando 3 o 4 campos no alcanzan."
      />
      <div className="flex flex-col gap-8 p-8">
        <AdvancedProspectSearch />
      </div>
    </>
  );
}
