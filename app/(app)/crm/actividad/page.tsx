import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Activity } from "lucide-react";

export default function ActividadPage() {
  return (
    <>
      <PageHeader
        title="Actividad"
        description="Historial de acciones: mensajes, cambios de etapa, notas y llamadas."
      />
      <div className="p-8">
        <EmptyState
          icon={Activity}
          title="Sin actividad registrada todavía"
          body="Cada acción del CRM y del Studio (mensaje generado, etapa movida, propuesta guardada) va a aparecer acá con fecha y responsable."
        />
      </div>
    </>
  );
}
