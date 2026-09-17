import { EmptyState } from "@/components/ui/EmptyState";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        Resumen de tareas, borradores, campañas y oportunidades.
      </p>
      <div className="mt-8">
        <EmptyState
          icon={LayoutDashboard}
          title="Conectá Supabase para activar el dashboard"
          body="En cuanto la organización tenga datos (empresas, contactos, deals), acá vas a ver el resumen del día."
        />
      </div>
    </div>
  );
}
