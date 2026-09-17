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
          <div className="overflow-hidden rounded-3xl border border-surface-border">
            <table className="w-full text-sm">
              <thead className="bg-surface/60 text-left text-xs uppercase tracking-wide text-muted-2">
                <tr>
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Cargo</th>
                  <th className="px-4 py-3 font-medium">Temperatura</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {contacts.map((c) => (
                  <tr key={c.id} className="bg-surface/30">
                    <td className="px-4 py-3 font-medium text-foreground">{c.full_name}</td>
                    <td className="px-4 py-3 text-muted">{c.role_title ?? "—"}</td>
                    <td className="px-4 py-3">
                      <TemperaturePicker contactId={c.id} value={c.temperature} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center gap-4 border-t border-surface-border bg-surface/40 px-4 py-2.5 text-xs text-muted-2">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-sky-400" /> Frío
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-orange-400" /> Tibio
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-red-500" /> Caliente
              </span>
            </div>
          </div>
        )}

        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-2">
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
                    <span className="font-mono text-xs uppercase tracking-wide text-lime">
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
