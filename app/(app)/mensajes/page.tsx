import { PageHeader } from "@/components/app/PageHeader";
import { TeamChat } from "@/components/app/TeamChat";
import { EmptyState } from "@/components/ui/EmptyState";
import { getOrgContext } from "@/lib/supabase/org";
import { MessagesSquare } from "lucide-react";

export default async function MensajesPage() {
  const ctx = await getOrgContext();

  return (
    <>
      <PageHeader
        title="Mensajes"
        description="Un chat para tu equipo: todos los integrantes de la organización ven y responden acá."
      />
      <div className="p-8">
        {ctx ? (
          <TeamChat />
        ) : (
          <EmptyState
            icon={MessagesSquare}
            title="Iniciá sesión para usar los mensajes"
            body="El chat del equipo se guarda en tu organización, así que necesita una sesión activa."
          />
        )}
      </div>
    </>
  );
}
