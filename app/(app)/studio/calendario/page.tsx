import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarDays } from "lucide-react";

const estados = [
  "IDEA",
  "PLANIFICADO",
  "BORRADOR",
  "DISEÑANDO",
  "REVISIÓN",
  "APROBADO",
  "PROGRAMADO",
  "PUBLICADO",
];

export default function CalendarioPage() {
  return (
    <>
      <PageHeader
        title="Calendario editorial"
        description="Compartido entre Studio y Social. Cada pieza avanza por estos estados."
      />
      <div className="flex flex-col gap-6 p-8">
        <div className="flex flex-wrap gap-2">
          {estados.map((estado) => (
            <Badge key={estado} tone="neutral">
              {estado}
            </Badge>
          ))}
        </div>
        <EmptyState
          icon={CalendarDays}
          title="Todavía no hay contenido planificado"
          body="Usá el planificador de calendario editorial en Studio → Herramientas para generar el primer mes, o cargá una pieza manualmente."
        />
      </div>
    </>
  );
}
