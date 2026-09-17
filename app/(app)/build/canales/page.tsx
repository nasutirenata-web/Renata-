import { PageHeader } from "@/components/app/PageHeader";
import { StrategySection } from "@/components/app/StrategySection";

export default function CanalesPage() {
  return (
    <>
      <PageHeader
        title="Canales"
        description="Estrategia de contacto por email y WhatsApp, y canales de venta."
      />
      <div className="flex flex-col gap-6 p-8">
        <StrategySection
          title="Canal de email"
          description="Cómo y cuándo se usa el email en la prospección."
          fields={[{ name: "email", label: "Rol del email en la secuencia de contacto" }]}
        />
        <StrategySection
          title="Canal de WhatsApp"
          description="Cuándo pasar de email a WhatsApp, y qué tono usar ahí."
          fields={[
            { name: "whatsapp_uso", label: "Cuándo se usa WhatsApp (momento del funnel)" },
            { name: "whatsapp_tono", label: "Tono y formato de los mensajes por WhatsApp" },
          ]}
        />
        <StrategySection
          title="Canales de venta"
          description="Los canales por los que efectivamente se concreta una venta."
          fields={[{ name: "canales_venta", label: "Canales de venta (directo, distribuidor, showroom, etc.)" }]}
        />
      </div>
    </>
  );
}
