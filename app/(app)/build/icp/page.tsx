import { PageHeader } from "@/components/app/PageHeader";
import { StrategySection } from "@/components/app/StrategySection";

export default function IcpPage() {
  return (
    <>
      <PageHeader
        title="Cliente ideal · ICP"
        description="A quién le vendés y cómo se segmentan tus comercios objetivo."
      />
      <div className="flex flex-col gap-6 p-8">
        <StrategySection
          title="Segmentación"
          description="Los criterios que definen una cuenta objetivo."
          fields={[
            { name: "segmento", label: "Segmentos (ej: comercio de barrio, cadena, negocio especializado)" },
            { name: "geografia", label: "Geografía / zona de cobertura" },
            { name: "tamano", label: "Tamaño o volumen estimado de compra" },
          ]}
        />
        <StrategySection
          title="Perfil del decisor"
          description="Quién decide la compra dentro del cliente B2B."
          fields={[
            { name: "decisor", label: "Cargo / rol del decisor" },
            { name: "criterios", label: "Qué mira al evaluar un nuevo proveedor" },
          ]}
        />
        <StrategySection
          title="Señales de fit"
          description="Qué hace que una cuenta sea prioritaria para prospectar ahora."
          fields={[{ name: "senales", label: "Señales de buen fit / buen timing" }]}
        />
      </div>
    </>
  );
}
