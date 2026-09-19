import { CrmRefresh } from "@/components/crm/CrmRefresh";
import { loadQualifiedContactIds, qualificationOf } from "@/lib/qualification";
import Link from "next/link";
import { KpiMeterView, type KpiData } from "@/components/kpi/KpiMeterView";
import { getPeriodWindows } from "@/lib/kpi-periods";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/supabase/org";

const STAGES = [
  { key: "contacto", label: "Primer contacto" },
  { key: "interes", label: "Interés" },
  { key: "reunion", label: "Reunión" },
  { key: "pedido", label: "Primer pedido" },
  { key: "cliente", label: "Cliente activo" },
];

const PERIOD_METRICS = [
  { label: "Leads nuevos", table: "contacts" },
  { label: "Empresas nuevas", table: "companies" },
  { label: "Oportunidades nuevas", table: "deals" },
  { label: "Actividades registradas", table: "activities" },
] as const;

// La ruta sigue siendo /dashboard para no romper accesos guardados; la pantalla se llama Medidor de KPIs.
export default async function KpiMeterPage() {
  const configured = isSupabaseConfigured();
  const ctx = await getOrgContext();

  let data: KpiData | null = null;
  let loadFailed = false;

  if (ctx) {
    const { supabase, orgId } = ctx;
    const countByTemperature = (temperature: string) =>
      supabase
        .from("contacts")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .eq("temperature", temperature);
    const countCreated = (table: (typeof PERIOD_METRICS)[number]["table"], from: string, to: string) =>
      supabase
        .from(table)
        .select("id", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .gte("created_at", from)
        .lt("created_at", to);

    const [hot, warm, cold, companies, deals, periodRows] = await Promise.all([
      countByTemperature("hot"),
      countByTemperature("warm"),
      countByTemperature("cold"),
      supabase.from("companies").select("id", { count: "exact", head: true }).eq("organization_id", orgId),
      supabase.from("deals").select("stage, value_estimate, currency, company_id").eq("organization_id", orgId),
      Promise.all(
        getPeriodWindows().map(async (w) => ({
          window: w,
          metrics: await Promise.all(
            PERIOD_METRICS.map(async (m) => {
              const [current, previous] = await Promise.all([
                countCreated(m.table, w.current.from, w.current.to),
                countCreated(m.table, w.previous.from, w.previous.to),
              ]);
              return {
                label: m.label,
                current: current.count ?? 0,
                previous: previous.count ?? 0,
                failed: Boolean(current.error || previous.error),
              };
            }),
          ),
        })),
      ),
    ]);

    loadFailed =
      [hot, warm, cold, companies, deals].some((r) => r.error) ||
      periodRows.some((p) => p.metrics.some((m) => m.failed));

    const dealRows = deals.data ?? [];
    const open = dealRows.filter((d) => d.stage !== "cliente");
    const totals = new Map<string, number>();
    for (const d of open) {
      if (d.value_estimate == null) continue;
      const currency = d.currency ?? "USD";
      totals.set(currency, (totals.get(currency) ?? 0) + Number(d.value_estimate));
    }

    const [contactRows, qualified] = await Promise.all([
      supabase.from("contacts").select("id, temperature, qualified_at").eq("organization_id",orgId).limit(10000),
      loadQualifiedContactIds(ctx),
    ]);
    loadFailed ||= Boolean(contactRows.error);
    const leadCounts = {hot:0,warm:0,cold:0,none:0};
    for (const contact of contactRows.data ?? []) leadCounts[qualificationOf(contact.temperature,Boolean(contact.qualified_at)||qualified.has(contact.id)) ?? "none"]++;
    data = {
      leads: leadCounts,
      companies: companies.count ?? 0,
      stages: STAGES.map((s) => ({ ...s, count: dealRows.filter((d) => d.stage === s.key).length })),
      openDeals: open.length,
      clients: new Set(dealRows.filter(d=>d.stage === "cliente" && d.company_id).map(d=>d.company_id)).size,
      pipelineValue: [...totals].map(([currency, total]) => ({ currency, total })),
      periods: periodRows.map(({ window: w, metrics }) => ({
        key: w.key,
        title: w.title,
        range: w.range,
        previousLabel: w.previousLabel,
        metrics: metrics.map(({ label, current, previous }) => ({ label, current, previous })),
      })),
    };
  }

  const isEmpty =
    !!data &&
    data.leads.hot + data.leads.warm + data.leads.cold + (data.leads.none ?? 0) + data.companies + data.openDeals + data.clients === 0;

  let notice: React.ReactNode = null;
  if (!configured) {
    notice = (
      <>
        Conectá Supabase en{" "}
        <Link href="/configuracion/integraciones" className="text-brand hover:underline">
          Configuración → Integraciones
        </Link>{" "}
        para ver los datos de tu organización. Mientras tanto no se muestran números.
      </>
    );
  } else if (!ctx) {
    notice = "Iniciá sesión con una organización para ver los datos de tu cuenta.";
  } else if (loadFailed) {
    notice = "No se pudieron leer algunos datos. Recargá la página para volver a intentar.";
  } else if (isEmpty) {
    notice = "Todavía no cargaste empresas, contactos ni oportunidades. En cuanto los cargues, estos medidores se completan solos.";
  }

  return <><CrmRefresh /><KpiMeterView data={loadFailed ? null : data} notice={notice} /></>;
}
