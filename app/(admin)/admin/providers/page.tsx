import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plug } from "lucide-react";

export default function AdminProvidersPage() {
  return (
    <>
      <PageHeader
        title="Providers"
        description="Proveedores disponibles para todos los workspaces (IA, datos, canales)."
      />
      <div className="p-8">
        <EmptyState
          icon={Plug}
          title="Sin providers configurados a nivel plataforma"
          body="Acá se administran las credenciales compartidas (Anthropic, LinkedIn, proveedores de datos B2B) antes de habilitarlas por workspace."
        />
      </div>
    </>
  );
}
