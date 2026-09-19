"use client";

import { useState } from "react";
import { ChevronDown, Download, Search, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FilterGroup, FilterPanel, RadioOptions, pillField } from "@/components/ui/FilterPanel";
import { LeadTrafficLight, type TemperatureCounts } from "@/components/crm/LeadTrafficLight";
import { TemperatureControl, type Temperature } from "@/components/crm/TemperatureControl";
import { KpiMeterView } from "@/components/kpi/KpiMeterView";
import { cn } from "@/lib/utils";
import {
  DEMO_KPIS, DEMO_INDUSTRIES, DEMO_LEADS, DEMO_LEVELS, DEMO_MESSAGES,
  DEMO_POST, DEMO_PROSPECTS, DEMO_STAGES, DEMO_STEPS, DEMO_WEEK,
} from "@/lib/demo-data";

// Todo lo que en la app real guardaría, enviaría o generaría con IA pasa por onLocked:
// la maqueta avisa que eso se activa al crear la cuenta, sin simular un resultado.
export type ViewProps = { onLocked: (action: string) => void };

const number = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

function ViewHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </div>
  );
}

export function KpiDemo() {
  return (
    <div className="-mx-8 -mt-6">
      <KpiMeterView
        data={DEMO_KPIS}
        example
        notice="Estos números son de ejemplo. En tu cuenta, los medidores se arman con tus contactos, empresas, oportunidades y actividad reales."
      />
    </div>
  );
}

export function EstrategiaDemo({ onLocked }: ViewProps) {
  const [step, setStep] = useState(0);
  const current = DEMO_STEPS[step];
  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Estrategia B2B" description="Completás los datos de la empresa donde trabajás y la IA te ayuda a armar su estrategia: para quién es, qué propone y cómo la van a medir." />
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ol className="glass-panel flex flex-col gap-1 rounded-3xl p-3">
          {DEMO_STEPS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setStep(i)}
                aria-current={i === step ? "step" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-colors",
                  i === step ? "capsule-nav-active" : "text-muted hover:bg-surface-2 hover:text-foreground",
                )}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-surface-border text-xs">{i + 1}</span>
                {s.title}
              </button>
            </li>
          ))}
        </ol>
        <section className="glass-panel flex flex-col gap-4 rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-muted-2">Paso {step + 1} de {DEMO_STEPS.length}</p>
          <h3 className="text-xl font-medium">{current.question}</h3>
          <div className="rounded-2xl border border-surface-border bg-surface-2 p-4 text-sm leading-relaxed text-muted">
            <span className="mb-1 block text-[10px] uppercase tracking-wider text-brand">Lo que completás vos (ejemplo)</span>
            {current.input}
          </div>
          <div className="glass-panel glass-panel-violet rounded-2xl p-4 text-sm leading-relaxed text-foreground/90">
            <span className="mb-1 block text-[10px] uppercase tracking-wider text-brand">Cómo te ayuda la IA (ejemplo)</span>
            {current.suggestion}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => onLocked("Armar la estrategia con IA")}><Sparkles className="h-4 w-4" />Armar con IA</Button>
            <Button variant="outline" onClick={() => onLocked("Descargar la estrategia en PDF")}><Download className="h-4 w-4" />Descargar PDF</Button>
            {step < DEMO_STEPS.length - 1 && <Button variant="ghost" onClick={() => setStep(step + 1)}>Siguiente →</Button>}
          </div>
        </section>
      </div>
    </div>
  );
}

export function ProspeccionDemo({ onLocked }: ViewProps) {
  const [industry, setIndustry] = useState("");
  const [level, setLevel] = useState("");
  const rows = DEMO_PROSPECTS.filter((p) => (!industry || p.industry === industry) && (!level || p.level === level));
  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Buscar oportunidades" description="Filtrá por industria y cargo para encontrar cuentas y decisores." />
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <FilterPanel>
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-foreground">Filtros</p>
            {(industry || level) && (
              <button type="button" onClick={() => { setIndustry(""); setLevel(""); }} className="text-xs text-muted transition-colors hover:text-brand">Limpiar</button>
            )}
          </div>
          <FilterGroup title="Industria" defaultOpen>
            <RadioOptions label="Industria" value={industry} onChange={setIndustry} options={DEMO_INDUSTRIES.map((v) => ({ value: v, label: v }))} />
          </FilterGroup>
          <FilterGroup title="Nivel del cargo" defaultOpen>
            <RadioOptions label="Nivel del cargo" value={level} onChange={setLevel} options={DEMO_LEVELS.map((v) => ({ value: v, label: v }))} />
          </FilterGroup>
        </FilterPanel>
        <section className="flex min-w-0 flex-col gap-3">
          <p className="px-4 text-xs text-muted-2">{rows.length} de {DEMO_PROSPECTS.length} resultados de ejemplo</p>
          {rows.length === 0 && <p className="glass-panel rounded-2xl px-5 py-6 text-center text-sm text-muted">Ningún resultado coincide con estos filtros.</p>}
          {rows.map((p) => (
            <div key={p.id} className="lead-row flex flex-wrap items-center justify-between gap-3 rounded-2xl p-3 sm:p-4">
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-foreground">{p.company}</p>
                <p className="mt-1 break-words text-xs text-muted">{p.role} · {p.industry} · {p.size} personas · {p.country}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onLocked("Guardar en el CRM")}>Guardar en el CRM</Button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export function ContactosDemo() {
  const [query, setQuery] = useState("");
  const [temp, setTemp] = useState<"" | Temperature>("");
  const [temps, setTemps] = useState<Record<string, Temperature>>(() => Object.fromEntries(DEMO_LEADS.map((l) => [l.id, l.temperature])));
  const q = query.trim().toLowerCase();
  const matched = DEMO_LEADS.filter((l) => !q || l.name.toLowerCase().includes(q) || l.role.toLowerCase().includes(q));
  const counts: TemperatureCounts = { hot: 0, warm: 0, cold: 0 };
  for (const l of matched) counts[temps[l.id]] += 1;
  const visible = temp ? matched.filter((l) => temps[l.id] === temp) : matched;
  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Contactos" description="Personas dentro de cada empresa, con su temperatura de interés. Probá cambiar una: en la maqueta no se guarda." />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_210px]">
        <section className="flex min-w-0 flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-2" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nombre o cargo" aria-label="Buscar contactos" className={pillField + " pl-10"} />
          </div>
          <p className="px-4 text-xs text-muted-2">{visible.length} de {DEMO_LEADS.length} leads de ejemplo</p>
          {visible.length === 0 && <p className="glass-panel rounded-2xl px-5 py-6 text-center text-sm text-muted">Ningún contacto coincide con estos filtros.</p>}
          {visible.map((l) => (
            <div key={l.id} className="lead-row grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-3 sm:p-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="lead-avatar hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-brand sm:flex" aria-hidden="true">{l.name.slice(0, 2).toUpperCase()}</span>
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-foreground">{l.name}</p>
                  <p className="mt-1 break-words text-xs text-muted">{l.role} · {l.company}</p>
                </div>
              </div>
              <TemperatureControl value={temps[l.id]} onChange={(t) => setTemps((prev) => ({ ...prev, [l.id]: t }))} />
            </div>
          ))}
        </section>
        <LeadTrafficLight counts={counts} total={matched.length} value={temp} onChange={setTemp} className="xl:sticky xl:top-6 xl:self-start" />
      </div>
    </div>
  );
}

export function PipelineDemo({ onLocked }: ViewProps) {
  const [open, setOpen] = useState<string[]>([DEMO_STAGES[0].id]);
  const toggle = (id: string) => setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Pipeline" description="De primer contacto a cliente activo. Abrí una etapa para ver sus oportunidades de ejemplo." />
      <div className="flex flex-col gap-3">
        {DEMO_STAGES.map((s) => {
          const isOpen = open.includes(s.id);
          const total = s.deals.reduce((sum, d) => sum + d.value, 0);
          return (
            <div key={s.id} className="lead-row rounded-2xl">
              <button type="button" onClick={() => toggle(s.id)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-3 p-4 text-left">
                <span className="text-sm font-semibold text-foreground">{s.label}</span>
                <span className="flex items-center gap-3 text-xs text-muted">
                  {s.deals.length} {s.deals.length === 1 ? "oportunidad" : "oportunidades"} · USD {number.format(total)}
                  <ChevronDown className={cn("h-4 w-4 text-muted-2 transition-transform", isOpen && "rotate-180")} />
                </span>
              </button>
              {isOpen && (
                <ul className="divide-y divide-surface-border/60 px-4 pb-2">
                  {s.deals.map((d) => (
                    <li key={d.title} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                      <span className="min-w-0"><span className="block break-words text-foreground">{d.title}</span><span className="text-xs text-muted">{d.company}</span></span>
                      <span className="shrink-0 font-display tabular-nums text-foreground">USD {number.format(d.value)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <div><Button variant="outline" onClick={() => onLocked("Nueva oportunidad")}>Nueva oportunidad</Button></div>
    </div>
  );
}

export function StudioDemo({ onLocked }: ViewProps) {
  const [tab, setTab] = useState<"borrador" | "calendario">("borrador");
  const [draft, setDraft] = useState(DEMO_POST);
  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Studio y LinkedIn" description="Preparás el contenido, lo revisás con tu equipo y lo organizás en el calendario." />
      <div className="glass-panel flex w-fit gap-1 rounded-full p-1 text-sm" role="tablist" aria-label="Secciones de Studio">
        {(["borrador", "calendario"] as const).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("rounded-full px-4 py-1.5 capitalize transition-colors", tab === t ? "capsule-button-primary" : "text-muted hover:text-foreground")}>{t}</button>
        ))}
      </div>
      {tab === "borrador" ? (
        <section className="glass-panel flex flex-col gap-4 rounded-3xl p-6">
          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Borrador de post para LinkedIn (ejemplo, podés editarlo)
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={8} className="resize-none rounded-2xl border border-surface-border bg-surface-2 px-4 py-3 text-sm leading-relaxed text-foreground outline-none focus:border-brand" />
          </label>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => onLocked("Generar con IA")}><Sparkles className="h-4 w-4" />Generar con IA</Button>
            <Button variant="outline" onClick={() => onLocked("Publicar en LinkedIn (requiere conectar tu cuenta)")}>Publicar en LinkedIn</Button>
          </div>
        </section>
      ) : (
        <section className="glass-panel rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-muted-2">Semana de ejemplo</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {DEMO_WEEK.map((d) => (
              <div key={d.day} className="rounded-2xl border border-surface-border bg-surface-2 p-3 text-sm">
                <p className="text-xs text-muted-2">{d.day}</p>
                <p className={cn("mt-2 min-h-10 text-xs leading-snug", d.item ? "text-foreground" : "text-muted-2")}>{d.item || "Sin publicaciones"}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function MensajesDemo({ onLocked }: ViewProps) {
  const [text, setText] = useState("");
  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Mensajes" description="Un chat para que tu equipo se comunique dentro de Capsule." />
      <section className="glass-panel flex flex-col gap-4 rounded-3xl p-6">
        <ul className="flex flex-col gap-3">
          {DEMO_MESSAGES.map((m) => (
            <li key={m.id} className={cn("flex flex-col gap-1", m.mine ? "items-end" : "items-start")}>
              <span className="text-[10px] text-muted-2">{m.author}</span>
              <span className={cn("max-w-md rounded-2xl px-4 py-2.5 text-sm", m.mine ? "capsule-button-primary" : "border border-surface-border bg-surface-2 text-foreground")}>{m.body}</span>
            </li>
          ))}
        </ul>
        <form onSubmit={(e) => { e.preventDefault(); onLocked("Enviar mensajes"); setText(""); }} className="flex items-center gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribí a tu equipo…" aria-label="Mensaje" className={pillField} />
          <button type="submit" aria-label="Enviar" className="capsule-button capsule-button-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full"><Send className="h-4 w-4" /></button>
        </form>
      </section>
    </div>
  );
}
