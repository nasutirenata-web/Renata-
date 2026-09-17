import { PageHeader, OriginTabs } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Users, Plus } from "lucide-react";

export default async function ContactosPage({
  searchParams,
}: {
  searchParams: Promise<{ origen?: string }>;
}) {
  const { origen } = await searchParams;
  const active = origen === "inbound" ? "inbound" : "outbound";

  return (
    <>
      <PageHeader
        title="Contactos"
        description="Personas dentro de cada empresa: cargo, canal preferido y estado."
        action={
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nuevo contacto
          </Button>
        }
      />
      <div className="flex flex-col gap-6 p-8">
        <OriginTabs active={active} />
        <EmptyState
          icon={Users}
          title={`Sin contactos de ${active === "outbound" ? "Outbound" : "Inbound"} todavía`}
          body="Los contactos se vinculan a una empresa y alimentan el email de prospección, el WhatsApp y el briefing pre-reunión del Studio."
        />
      </div>
    </>
  );
}
