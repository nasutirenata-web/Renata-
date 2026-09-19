import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { LinkButton } from "@/components/ui/Button";
import { RecordSignal } from "@/components/crm/RecordSignal";
import { CrmRefresh } from "@/components/crm/CrmRefresh";
import { TemperatureBadge } from "@/components/crm/TemperatureBadge";
import { getOrgContext } from "@/lib/supabase/org";
import { QUALIFICATION_KIND, qualificationOf } from "@/lib/qualification";
import { activityDetail, activityLabel } from "@/lib/activity-text";
import { formatDateTime } from "@/lib/utils";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CHANNELS: Record<string, string> = { email: "Email", whatsapp: "WhatsApp", linkedin: "LinkedIn" };

export default async function ContactoFichaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const ctx = await getOrgContext();
  if (!ctx) {
    return <p className="m-8 glass-panel rounded-2xl px-5 py-4 text-sm text-muted">Iniciá sesión para ver esta ficha.</p>;
  }

  const { data: contact } = await ctx.supabase
    .from("contacts")
    .select("id, full_name, role_title, email, phone, preferred_channel, origin, temperature, company_id, qualification_reason, qualified_at")
    .eq("organization_id", ctx.orgId)
    .eq("id", id)
    .maybeSingle();
  if (!contact) notFound();

  const [company, history] = await Promise.all([
    contact.company_id
      ? ctx.supabase.from("companies").select("name").eq("organization_id", ctx.orgId).eq("id", contact.company_id).maybeSingle()
      : Promise.resolve({ data: null }),
    // Solo el historial de esta persona; los eventos generales viven en Actividad.
    ctx.supabase
      .from("activities")
      .select("id, kind, body, created_at")
      .eq("organization_id", ctx.orgId)
      .eq("contact_id", id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const events = history.data ?? [];
  const qualification = qualificationOf(contact.temperature, Boolean(contact.qualified_at) || events.some((e) => e.kind === QUALIFICATION_KIND));
  const companyName = company.data?.name ?? null;

  return (
    <div className="flex flex-col gap-5 p-5 sm:p-8">
      <CrmRefresh />
      <Link href="/crm/contactos" className="flex w-fit items-center gap-1.5 text-xs text-muted transition-colors hover:text-brand">
        <ArrowLeft className="h-3.5 w-3.5" /> Contactos
      </Link>

      <section className="glass-panel flex flex-wrap items-start justify-between gap-4 rounded-2xl p-5">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar name={contact.full_name} size={56} />
          <div className="min-w-0">
            <h1 className="break-words text-xl font-semibold text-foreground">{contact.full_name}</h1>
            <p className="mt-0.5 break-words text-sm text-muted">
              {contact.role_title ?? "Sin cargo"}
              {companyName ? ` · ${companyName}` : ""}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
              <span>{contact.origin === "inbound" ? "Origen: Inbound" : "Origen: Outbound"}</span>
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-brand">
                  <Mail className="h-3.5 w-3.5" /> {contact.email}
                </a>
              )}
              {contact.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> {contact.phone}
                </span>
              )}
              {contact.preferred_channel && <span>Canal preferido: {CHANNELS[contact.preferred_channel] ?? contact.preferred_channel}</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-[11px] uppercase tracking-wide text-muted-2">Estado</p>
          <TemperatureBadge value={qualification} reason={contact.qualification_reason} updatedAt={contact.qualified_at} />
          <p className="max-w-xs text-right text-xs text-muted">{contact.qualification_reason ?? "Todavía no hay señales suficientes para cualificar."}</p>
          {contact.qualified_at && <p className="text-xs text-muted">{formatDateTime(contact.qualified_at)}</p>}
          <LinkButton href={`/studio/scoring-leads?contacto=${contact.id}`} size="sm" variant="outline">
            <Sparkles className="h-4 w-4" /> Analizar encaje con IA
          </LinkButton>
        </div>
      </section>

      <RecordSignal contactId={contact.id} />
      <section className="glass-panel overflow-hidden rounded-2xl" aria-label="Historial">
        <h2 className="border-b border-surface-border/60 px-4 py-3 text-sm font-semibold text-foreground">Historial</h2>
        {history.error ? <p role="alert" className="p-4 text-sm text-danger">No se pudo cargar el historial.</p> : events.length === 0 ? (
          <p className="px-4 py-5 text-sm text-muted">Todavía no hay historial de esta persona.</p>
        ) : (
          <ul className="divide-y divide-surface-border/60">
            {events.map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-4 px-4 py-2.5 text-sm">
                <span className="min-w-0">
                  <span className="block font-medium text-foreground">{activityLabel(e.kind)}</span>
                  {activityDetail(e.body) && <span className="block break-words text-xs text-muted">{activityDetail(e.body)}</span>}
                </span>
                <span className="shrink-0 text-xs text-muted-2">{formatDateTime(e.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
