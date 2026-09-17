import { PageHeader } from "@/components/app/PageHeader";
import { StrategySection } from "@/components/app/StrategySection";

export default function PreciosPage() {
  return (
    <>
      <PageHeader
        title="Precios y rentabilidad"
        description="Estructura de precios, márgenes y rentabilidad por canal."
      />
      <div className="flex flex-col gap-6 p-8">
        <StrategySection
          title="Estructura de precios"
          description="Cómo se arma el precio para el punto de venta."
          fields={[
            { name: "lista", label: "Lista de precios / rangos por línea de producto", rows: 4 },
            { name: "descuentos", label: "Descuentos por volumen o condición" },
          ]}
        />
        <StrategySection
          title="Márgenes y rentabilidad"
          description="Qué margen deja cada canal y dónde está el piso aceptable."
          fields={[
            { name: "margen", label: "Margen objetivo por canal" },
            { name: "piso", label: "Piso de precio / margen mínimo aceptable" },
          ]}
        />
      </div>
    </>
  );
}
