import { PageHeader } from "@/components/app/PageHeader";
import { StrategySection } from "@/components/app/StrategySection";

export default function OfertaPage() {
  return (
    <>
      <PageHeader
        title="Oferta y catálogo"
        description="La propuesta comercial para el punto de venta y su presentación."
      />
      <div className="flex flex-col gap-6 p-8">
        <StrategySection
          title="Propuesta comercial"
          description="Qué se ofrece concretamente a un comercio."
          fields={[
            { name: "oferta", label: "Descripción de la oferta" },
            { name: "condiciones", label: "Condiciones comerciales (mínimos, plazos, logística)" },
          ]}
        />
        <StrategySection
          title="Catálogo / presentación comercial"
          description="Los productos o líneas que se muestran en el primer contacto."
          fields={[{ name: "catalogo", label: "Listado de productos / líneas, con lo más relevante de cada una", rows: 5 }]}
        />
      </div>
    </>
  );
}
