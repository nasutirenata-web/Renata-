import { PageHeader, OriginTabs } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { NewContactForm } from "@/components/crm/NewContactForm";
import { TemperaturePicker } from "@/components/crm/TemperaturePicker";
import { getOrgContext } from "@/lib/supabase/org";
import { formatDateTime } from "@/lib/utils";
import { Users, ClipboardList } from "lucide-react";

export default async function ContactosPage({
  searchParams,
}: {
  searchParams: Promise<{ origen?: string }>;
}) {
  const { origen } = await searchParams;
  const active = origen === "inbound" ? "inbound" : "outbound";

  const ctx = await getOrgContext();

  const contacts = ctx
    ? (
        await ctx.supabase
          .from("contacts")
          .select("id, full_name, role_title, temperature, created_at")
          .eq("organization_id", ctx.orgId)
          .eq("origin", active)
          .order("created_at", { ascending: false })
      ).data ?? []
    : [];

  const activities = ctx
    ? (
        await ctx.supabase
          .from("activities")
          .select("id, kind, body, created_at")
          .eq("organization_id", ctx.orgId)
          .order("created_at", { ascending: false })
          .limit(10)
      ).data ?? []
    : [];

  return (
    <>
      <PageHeader
        title="Contactos"
        description="Personas dentro de cada empresa, con su temperatura de interés."
        action={<NewContactForm origin={active} />}
      />
      <div className="flex flex-col gap-8 p-8">
        <OriginTabs active={active} />

        {!ctx && (
          <EmptyState
            icon={Users}
            title="Conectá Supabase para guardar contactos reales"
            body="Sin Supabase esta lista queda vacía a propósito, en vez de mostrar datos falsos."
          />
        )}

        {ctx && contacts.length === 0 && (
          <EmptyState
            icon={Users}
            title={`Sin contactos de ${active === "outbound" ? "Outbound" : "Inbound"} todavía`}
            body="Usá 'Nuevo contacto' arriba para cargar el primero."
          />
        )}

        {ctx && contacts.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between px-4 text-xs text-muted-2">
              <span>Lead / cargo</span>
              <span>Temperatura</span>
            </div>
            {contacts.map((c) => (
              <div
                key={c.id}
                className="lead-row grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-3 sm:p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="lead-avatar hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-brand sm:flex"
                    aria-hidden="true"
                  >
                    {c.full_name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-foreground">{c.full_name}</p>
                    <p className="mt-1 break-words text-xs text-muted">{c.role_title ?? "Sin cargo asignado"}</p>
                  </div>
                </div>
                <TemperaturePicker contactId={c.id} value={c.temperature} />
              </div>
            ))}
            <div className="glass-panel flex items-center gap-4 rounded-2xl px-4 py-3 text-xs text-muted-2">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-muted-2" /> Frío
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-aqua-bright" /> Tibio
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-brand-dim" /> Caliente
              </span>
            </div>
          </div>
        )}

        <div>
          <p className="mb-4 font-logo text-xs uppercase tracking-[0.2em] text-muted-2">
            Resultado de cada proceso terminado
          </p>
          {!ctx || activities.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Sin resultados registrados todavía"
              body="Cuando se complete un envío, una llamada o un cambio de etapa, el resultado va a aparecer acá."
            />
          ) : (
            <div className="flex flex-col gap-2">
              {activities.map((a) => (
                <Card key={a.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <span className="font-logo text-xs uppercase tracking-wide text-brand">
                      {a.kind}
                    </span>
                    <p className="mt-1 text-sm text-foreground/90">{a.body}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-2">
                    {formatDateTime(a.created_at)}
                  </span>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
