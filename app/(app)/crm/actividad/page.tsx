import { CrmRefresh } from "@/components/crm/CrmRefresh";
import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { getOrgContext } from "@/lib/supabase/org";
import { activityDetail, activityLabel } from "@/lib/activity-text";
import { formatDateTime } from "@/lib/utils";

export default async function ActividadPage() {
  const ctx = await getOrgContext();

  const result = ctx
    ? (
        await ctx.supabase
          .from("activities")
          .select("id, kind, body, created_at, contact_id, company_id, deal_id, created_by")
          .eq("organization_id", ctx.orgId)
          .order("created_at", { ascending: false })
          .limit(100)
      )
    : null;
  const activities = result?.data ?? [];

  const contactIds = [...new Set(activities.map((a) => a.contact_id).filter((id): id is string => Boolean(id)))];
  const contactNames = new Map<string, string>();
  if (ctx && contactIds.length > 0) {
    const { data } = await ctx.supabase.from("contacts").select("id, full_name").eq("organization_id", ctx.orgId).in("id", contactIds);
    for (const c of data ?? []) contactNames.set(c.id, c.full_name);
  }

  return (
    <>
      <CrmRefresh />
      <PageHeader title="Actividad" description="Lo que se hizo en tu espacio, en orden: altas, cualificaciones, búsquedas y estrategia." />
      <div className="p-5 sm:p-8">
        {!ctx ? (
          <p className="glass-panel rounded-2xl px-5 py-4 text-sm text-muted">Iniciá sesión para ver la actividad de tu organización.</p>
        ) : result?.error ? (<p role="alert" className="text-sm text-danger">No se pudo cargar la actividad. Recargá para reintentar.</p>) : activities.length === 0 ? (
          <p className="glass-panel rounded-2xl px-5 py-4 text-sm text-muted">
            Todavía no hay actividad. Se va a llenar sola a medida que agregues contactos, cualifiques leads o guardes tu estrategia.
          </p>
        ) : (
          <ul className="glass-panel divide-y divide-surface-border/60 overflow-hidden rounded-2xl">
            {activities.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-4 px-4 py-2.5 text-sm">
                <span className="min-w-0">
                  <span className="block font-medium text-foreground">{activityLabel(a.kind)}</span>
                  {activityDetail(a.body) && <span className="block break-words text-xs text-muted">{activityDetail(a.body)}</span>}
                  <span className="mt-1 block text-[11px] text-muted-2">{a.created_by === ctx?.user.id ? (ctx.user.user_metadata?.full_name || "Vos") : a.created_by ? "Integrante del equipo" : "Sistema"}</span>
                  {a.deal_id && <Link href={`/crm/pipeline#deal-${a.deal_id}`} className="mr-3 text-xs text-brand hover:underline">Ver oportunidad</Link>}
                  {!a.deal_id && a.kind === "estrategia_guardada" && <Link href="/build/estrategia" className="mr-3 text-xs text-brand hover:underline">Ver estrategia</Link>}
                  {a.contact_id && contactNames.has(a.contact_id) && (
                    <Link href={`/crm/contactos/${a.contact_id}`} className="mt-0.5 inline-block text-xs text-brand hover:underline">
                      Ver a {contactNames.get(a.contact_id)}
                    </Link>
                  )}
                </span>
                <span className="shrink-0 text-xs text-muted-2">{formatDateTime(a.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
