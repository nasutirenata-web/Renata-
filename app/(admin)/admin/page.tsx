import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Building2 } from "lucide-react";

export default function AdminWorkspacesPage() {
  return (
    <>
      <PageHeader
        title="Workspaces"
        description="Cada cliente de Capsule GTM (como Varowa) es un workspace aislado."
      />
      <div className="p-8">
        <EmptyState
          icon={Building2}
          title="Sin workspaces todavía"
          body="En cuanto Supabase esté conectado, acá vas a ver cada organización cliente: plan, uso, integraciones activas y estado general."
        />
      </div>
    </>
  );
}
