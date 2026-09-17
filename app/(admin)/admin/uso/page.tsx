import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Activity } from "lucide-react";

export default function AdminUsoPage() {
  return (
    <>
      <PageHeader title="Uso" description="Consumo de IA, mensajes y generación por workspace." />
      <div className="p-8">
        <EmptyState
          icon={Activity}
          title="Sin datos de uso todavía"
          body="Cuando haya generación de IA real, acá vas a ver tokens y costo por workspace."
        />
      </div>
    </>
  );
}
