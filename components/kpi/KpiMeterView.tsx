import { BadgeCheck, Building2, Info, KanbanSquare, Megaphone, Users } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";

export type KpiMetric = { label: string; current: number; previous: number };
export type KpiPeriod = { key: string; title: string; range: string; previousLabel: string; metrics: KpiMetric[] };

export type KpiData = {
  leads: { hot: number; warm: number; cold: number; none?: number };
  companies: number;
  stages: { key: string; label: string; count: number }[];
  openDeals: number;
  clients: number;
  pipelineValue: { currency: string; total: number }[];
  periods: KpiPeriod[];
};

const number = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

// Clases completas para que Tailwind las detecte.
const TEMPS = [
  { key: "hot", label: "Caliente", dot: "bg-temp-hot" },
  { key: "warm", label: "Medio", dot: "bg-temp-warm" },
  { key: "cold", label: "Frío", dot: "bg-temp-cold" },
] as const;

const CAMPAIGN_METERS = ["Aperturas", "Respuestas", "Reuniones"];

const PLACEHOLDER_STAGES = [
  { key: "contacto", label: "Primer contacto", count: 0 },
  { key: "interes", label: "Interés", count: 0 },
  { key: "reunion", label: "Reunión", count: 0 },
  { key: "pedido", label: "Primer pedido", count: 0 },
  { key: "cliente", label: "Cliente activo", count: 0 },
];

const PLACEHOLDER_PERIODS: KpiPeriod[] = [
  { key: "week", title: "Semanal", range: "", previousLabel: "semana anterior", metrics: [] },
  { key: "month", title: "Mensual", range: "", previousLabel: "mes anterior", metrics: [] },
  { key: "quarter", title: "Trimestral", range: "", previousLabel: "trimestre anterior", metrics: [] },
];

const PLACEHOLDER_LABELS = ["Contactos nuevos", "Empresas nuevas", "Oportunidades nuevas", "Actividades registradas"];

export function KpiMeterView({
  data,
  notice,
  example = false,
}: {
  data: KpiData | null;
  notice?: React.ReactNode;
  example?: boolean;
}) {
  const totalLeads = data ? data.leads.hot + data.leads.warm + data.leads.cold + (data.leads.none ?? 0) : null;
  const maxStage = data ? Math.max(1, ...data.stages.map((s) => s.count)) : 1;
  const valueHint = data?.pipelineValue.length
    ? data.pipelineValue.map((v) => `${v.currency} ${number.format(v.total)}`).join(" · ")
    : data
      ? "Sin monto cargado"
      : "";

  const totals = [
    { label: "Contactos", value: totalLeads, hint: data ? "Contactos en tu CRM" : "", icon: Users },
    { label: "Empresas", value: data?.companies ?? null, hint: data ? "Cuentas registradas" : "", icon: Building2 },
    { label: "Oportunidades abiertas", value: data?.openDeals ?? null, hint: valueHint, icon: KanbanSquare },
    { label: "Clientes activos", value: data?.clients ?? null, hint: data ? "Empresas con oportunidades en la etapa final" : "", icon: BadgeCheck },
  ];

  const periods = data?.periods ?? PLACEHOLDER_PERIODS;

  return (
    <>
      <PageHeader
        title="Medidor de KPIs"
        description="Métricas semanales, mensuales y trimestrales, con el período anterior como referencia."
        action={
          example ? (
            <span className="rounded-full border border-surface-border bg-surface-2 px-3 py-1 text-xs text-muted">
              Datos de ejemplo
            </span>
          ) : undefined
        }
      />
      <div className="flex flex-col gap-5 p-8">
        <section aria-label="Totales" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {totals.map(({ label, value, hint, icon: Icon }, i) => (
            <article key={label} className={"glass-panel rounded-3xl p-5 " + (i % 2 === 0 ? "glass-panel-violet" : "glass-panel-aqua")}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted">{label}</span>
                <span className="glass-icon flex h-9 w-9 items-center justify-center rounded-xl text-brand">
                  <Icon className="h-4 w-4" strokeWidth={1.7} />
                </span>
              </div>
              <p className="mt-4 font-display text-4xl font-medium leading-none tabular-nums text-foreground">
                {value == null ? "—" : number.format(value)}
              </p>
              <p className="mt-2 min-h-4 text-xs text-muted-2">{hint}</p>
            </article>
          ))}
        </section>

        <section aria-label="Métricas por período" className="grid gap-4 lg:grid-cols-3">
          {periods.map((period) => (
            <article key={period.key} className="glass-panel rounded-3xl p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h2 className="text-base font-semibold text-foreground">{period.title}</h2>
                <span className="text-xs text-muted-2">{period.range}</span>
              </div>
              <ul className="mt-4 space-y-4">
                {(data ? period.metrics : PLACEHOLDER_LABELS.map((label) => ({ label, current: 0, previous: 0 }))).map((m) => {
                  const scale = Math.max(m.current, m.previous, 1);
                  return (
                    <li key={m.label}>
                      <div className="flex items-end justify-between gap-3">
                        <span className="text-sm text-muted">{m.label}</span>
                        <span className="font-display text-2xl tabular-nums text-foreground">
                          {data ? number.format(m.current) : "—"}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                        <div className="h-full rounded-full bg-brand/70" style={{ width: `${data ? (m.current / scale) * 100 : 0}%` }} />
                      </div>
                      <p className="mt-1 text-[11px] text-muted-2">
                        {period.previousLabel}: {data ? number.format(m.previous) : "—"}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          <section className="glass-panel rounded-3xl p-5" aria-label="Semáforo de leads">
            <h2 className="text-base font-semibold text-foreground">Semáforo de leads</h2>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
              {data && totalLeads
                ? TEMPS.map((t) => (
                    <span key={t.key} className={t.dot} style={{ width: `${(data.leads[t.key] / totalLeads) * 100}%` }} />
                  ))
                : null}
            </div>
            <ul className="mt-4 space-y-2.5">
              {TEMPS.map((t) => (
                <li key={t.key} className="flex items-center gap-3 text-sm">
                  <span className={"temp-dot " + t.dot} aria-hidden="true" />
                  <span className="text-muted">{t.label}</span>
                  <span className="ml-auto font-display tabular-nums text-foreground">
                    {data ? number.format(data.leads[t.key]) : "—"}
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between text-sm text-muted"><span>Sin cualificar</span><span>{data ? number.format(data.leads.none ?? 0) : "—"}</span></li>
            </ul>
          </section>

          <section className="glass-panel rounded-3xl p-5" aria-label="Pipeline por etapa">
            <h2 className="text-base font-semibold text-foreground">Pipeline por etapa</h2>
            <ul className="mt-4 space-y-3">
              {(data?.stages ?? PLACEHOLDER_STAGES).map((s) => (
                <li key={s.key} className="text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted">{s.label}</span>
                    <span className="font-display tabular-nums text-foreground">{data ? number.format(s.count) : "—"}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                    <div className="h-full rounded-full bg-brand/70" style={{ width: `${data ? (s.count / maxStage) * 100 : 0}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-panel rounded-3xl p-5" aria-label="KPIs de campañas">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">KPIs de campañas</h2>
              <Megaphone className="h-4 w-4 text-muted-2" strokeWidth={1.7} aria-hidden="true" />
            </div>
            <ul className="mt-4 space-y-3">
              {CAMPAIGN_METERS.map((name) => (
                <li key={name} className="text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted">{name}</span>
                    <span className="font-display text-muted-2">—</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-surface-2" aria-hidden="true" />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-2">
              Las métricas de campañas requieren una fuente conectada. Generar un mensaje no registra un envío, una respuesta ni una reunión.
            </p>
          </section>
        </div>

        <p className="px-1 text-xs leading-relaxed text-muted-2">
          Cómo se mide: se cuentan los contactos, empresas y oportunidades que se crean, y la actividad que Capsule registra (búsquedas, cualificaciones, estrategia guardada y contenido generado con IA). Los borradores de contenido y el calendario todavía no se guardan en Capsule, por eso no se miden.
        </p>

        {notice && (
          <div role="status" className="glass-panel flex items-start gap-3 rounded-3xl p-5 text-sm text-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={1.7} aria-hidden="true" />
            <div className="leading-relaxed">{notice}</div>
          </div>
        )}
      </div>
    </>
  );
}
