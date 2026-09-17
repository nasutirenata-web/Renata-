import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Flag } from "lucide-react";

export default function AdminFlagsPage() {
  return (
    <>
      <PageHeader title="Feature flags" description="Activar funciones nuevas por workspace antes de lanzarlas a todos." />
      <div className="p-8">
        <EmptyState icon={Flag} title="Sin feature flags creados todavía" />
      </div>
    </>
  );
}
