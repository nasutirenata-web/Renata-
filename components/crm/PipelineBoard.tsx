import Link from "next/link";
import { DealStageSelect } from "@/components/crm/DealStageSelect";
import { TemperatureBadge } from "@/components/crm/TemperatureBadge";
import type { Temperature } from "@/lib/qualification";
import { cn } from "@/lib/utils";

export type DealContact = { id: string; name: string; qualification: Temperature | null; reason?: string | null; updatedAt?: string | null };
export type PipelineDeal = {
  id: string;
  title: string;
  value_estimate: number | null;
  currency: string;
  company: string | null;
  contacts: DealContact[];
};
export type PipelineStage = { key: string; label: string; deals: PipelineDeal[] };

const MAX_CONTACTS = 3;

function formatValue(value: number | null, currency: string) {
  if (value == null) return null;
  try {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString("es-AR")}`;
  }
}

// Totales por moneda: nunca se suman monedas distintas.
function stageTotals(deals: PipelineDeal[]) {
  const totals = new Map<string, number>();
  for (const d of deals) if (d.value_estimate != null) totals.set(d.currency, (totals.get(d.currency) ?? 0) + d.value_estimate);
  return [...totals].map(([currency, total]) => formatValue(total, currency)).filter(Boolean).join(" · ");
}

// Cinco etapas en el orden del proceso: tres arriba y dos abajo en escritorio, una columna en móvil.
// La etapa y la cualificación del lead son cosas separadas: cualificar nunca mueve la oportunidad.
export function PipelineBoard({ stages, interactive = false }: { stages: PipelineStage[]; interactive?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
      {stages.map((stage, index) => {
        const totals = stageTotals(stage.deals);
        return (
          <section
            key={stage.key}
            aria-label={stage.label}
            className={cn("glass-panel flex flex-col gap-3 rounded-3xl p-4", index < 3 ? "md:col-span-2" : "md:col-span-3")}
          >
            <header className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-foreground">{stage.label}</h2>
                {totals && <p className="mt-0.5 text-xs text-muted">{totals}</p>}
              </div>
              <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-surface-2 px-2 text-xs font-medium text-muted">
                {stage.deals.length}
              </span>
            </header>

            {stage.deals.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-surface-border px-3 py-4 text-center text-xs text-muted-2">
                Sin oportunidades en esta etapa
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {stage.deals.map((deal) => {
                  const value = formatValue(deal.value_estimate, deal.currency);
                  const shown = deal.contacts.slice(0, MAX_CONTACTS);
                  const extra = deal.contacts.length - shown.length;
                  return (
                    <li key={deal.id} id={`deal-${deal.id}`} className="rounded-2xl bg-surface-2 px-3 py-2.5 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="break-words font-medium text-foreground">{deal.title}</p>
                          {deal.company && <p className="mt-0.5 break-words text-xs text-muted">{deal.company}</p>}
                        </div>
                        {value && <span className="shrink-0 text-xs text-muted">{value}</span>}
                      </div>

                      {interactive && <DealStageSelect id={deal.id} stage={stage.key} />}
                      <div className="mt-2 border-t border-surface-border/60 pt-2">
                        {deal.contacts.length === 0 ? (
                          <p className="text-xs text-muted-2">Sin contacto asociado</p>
                        ) : (
                          <>
                            {deal.contacts.length > 1 && (
                              <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-2">Cualificación de cada contacto</p>
                            )}
                            <ul className="flex flex-col gap-1.5">
                              {shown.map((c) => (
                                <li key={c.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                  <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                                    <TemperatureBadge value={c.qualification} reason={c.reason} updatedAt={c.updatedAt} />
                                    <Link href={`/crm/contactos/${c.id}`} className="truncate text-xs text-muted hover:text-brand">
                                      {deal.contacts.length > 1 ? c.name : `Contacto: ${c.name}`}
                                    </Link>
                                  </span>
                                  {c.reason && <p className="w-full text-[11px] text-muted">{c.reason}</p>}
                                </li>
                              ))}
                              {extra > 0 && <li className="text-xs text-muted-2">+{extra} {extra === 1 ? "contacto más" : "contactos más"}</li>}
                            </ul>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
