import { PageHeader } from "@/components/app/PageHeader";
import { StrategySection } from "@/components/app/StrategySection";

export default function EstrategiaPage() {
  return (
    <>
      <PageHeader
        title="Estrategia B2B"
        description="La base común: por qué existe el negocio, para quién, y qué lo hace ganar."
      />
      <div className="flex flex-col gap-6 p-8">
        <StrategySection
          title="Business Profile"
          description="Qué hace la empresa, en qué mercado compite y con qué diferenciales."
          fields={[
            { name: "que_hace", label: "Qué hace la empresa (en una frase)" },
            { name: "mercado", label: "Mercado y geografía" },
            { name: "diferenciales", label: "Diferenciales frente a la competencia" },
          ]}
        />
        <StrategySection
          title="Propuesta de valor"
          description="Por qué una farmacia o comercio debería comprarte a vos y no a otro proveedor."
          fields={[
            { name: "problema", label: "Problema que resolvés para el punto de venta" },
            { name: "valor", label: "Propuesta de valor concreta" },
            { name: "prueba", label: "Evidencia o casos que la respaldan" },
          ]}
        />
        <StrategySection
          title="Objetivo comercial"
          description="A dónde tiene que llegar el sistema comercial este semestre."
          fields={[{ name: "objetivo", label: "Objetivo principal y métrica de éxito" }]}
        />
      </div>
    </>
  );
}
