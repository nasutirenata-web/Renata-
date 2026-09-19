"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { LinkButton } from "@/components/ui/Button";
import { NewContactForm } from "@/components/crm/NewContactForm";
import { TemperatureBadge } from "@/components/crm/TemperatureBadge";
import { QUALIFICATION_LABELS, type Temperature } from "@/lib/qualification";
import { cn } from "@/lib/utils";

export type BoardContact = {
  id: string;
  full_name: string;
  role_title: string | null;
  email: string | null;
  company: string | null;
  origin: "outbound" | "inbound";
  qualificationReason?: string | null;
  qualifiedAt?: string | null;
  qualification: Temperature | null; // null = sin cualificar (no es lo mismo que Frío)
};

type OriginFilter = "" | "outbound" | "inbound";
type StateFilter = "" | Temperature | "none";

const ORIGINS: { value: OriginFilter; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "outbound", label: "Outbound" },
  { value: "inbound", label: "Inbound" },
];

const STATE_DOT: Record<Temperature, string> = { hot: "temp-dot-hot", warm: "temp-dot-warm", cold: "temp-dot-cold" };

const COLUMNS = "grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,2.4fr)_minmax(0,1.5fr)_84px_auto]";

export function ContactsBoard({
  contacts,
  companies,
}: {
  contacts: BoardContact[];
  companies: { id: string; name: string }[];
}) {
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState<OriginFilter>("");
  const [state, setState] = useState<StateFilter>("");

  if (contacts.length === 0) {
    return (
      <div className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4">
        <div>
          <p className="text-sm font-medium text-foreground">Todavía no hay contactos guardados</p>
          <p className="mt-0.5 text-xs text-muted">
            Buscá prospectos y guardá a las personas que encajen. También podés cargar uno a mano.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LinkButton href="/prospeccion" size="sm">
            <Search className="h-4 w-4" /> Buscar prospectos
          </LinkButton>
          <NewContactForm companies={companies} />
        </div>
      </div>
    );
  }

  const q = query.trim().toLowerCase();
  const matching = contacts.filter(
    (c) =>
      (!origin || c.origin === origin) &&
      (!q || [c.full_name, c.role_title, c.company, c.email].some((v) => (v ?? "").toLowerCase().includes(q))),
  );
  const counts = { hot: 0, warm: 0, cold: 0, none: 0 };
  for (const c of matching) counts[c.qualification ?? "none"] += 1;
  const visible = state ? matching.filter((c) => (c.qualification ?? "none") === state) : matching;

  const chips: { value: StateFilter; label: string; count: number; dot?: string }[] = [
    { value: "", label: "Todos", count: matching.length },
    { value: "hot", label: QUALIFICATION_LABELS.hot, count: counts.hot, dot: STATE_DOT.hot },
    { value: "warm", label: QUALIFICATION_LABELS.warm, count: counts.warm, dot: STATE_DOT.warm },
    { value: "cold", label: QUALIFICATION_LABELS.cold, count: counts.cold, dot: STATE_DOT.cold },
    { value: "none", label: "Sin cualificar", count: counts.none },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, empresa, cargo o email"
            aria-label="Buscar contactos"
            className="w-full rounded-full border border-surface-border bg-surface-2 py-2 pl-10 pr-4 text-sm outline-none focus:border-brand"
          />
        </div>
        <div role="radiogroup" aria-label="Origen" className="glass-panel flex gap-1 rounded-full p-1 text-sm">
          {ORIGINS.map((o) => (
            <button
              key={o.value || "todos"}
              type="button"
              role="radio"
              aria-checked={origin === o.value}
              onClick={() => setOrigin(o.value)}
              className={cn(
                "rounded-full px-3.5 py-1 transition-colors",
                origin === o.value ? "capsule-button-primary" : "text-muted hover:text-foreground",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <NewContactForm companies={companies} />
      </div>

      <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap items-center gap-2">
        {chips.map((chip) => (
          <button
            key={chip.value || "todos"}
            type="button"
            aria-pressed={state === chip.value}
            onClick={() => setState(state === chip.value ? "" : chip.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
              state === chip.value
                ? "border-brand bg-brand/10 text-brand"
                : "border-surface-border bg-surface-2 text-muted hover:text-foreground",
            )}
          >
            {chip.dot ? (
              <span className={cn("temp-dot !mr-0", chip.dot)} aria-hidden="true" />
            ) : chip.value === "none" ? (
              <span className="inline-block h-2.5 w-2.5 rounded-full border border-muted-2" aria-hidden="true" />
            ) : null}
            {chip.label} <span className="tabular-nums opacity-70">{chip.count}</span>
          </button>
        ))}
      </div>

      <section aria-label="Lista de contactos" className="glass-panel overflow-hidden rounded-2xl">
        <div className={cn("hidden gap-x-4 border-b border-surface-border/60 px-4 py-2 text-[11px] uppercase tracking-wide text-muted-2 md:grid", COLUMNS)}>
          <span>Persona</span>
          <span>Empresa</span>
          <span>Origen</span>
          <span className="text-right">Estado</span>
        </div>
        {visible.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-muted">Ningún contacto coincide con estos filtros.</p>
        ) : (
          <ul className="divide-y divide-surface-border/60">
            {visible.map((c) => (
              <li key={c.id} className={cn("grid items-center gap-x-4 gap-y-1.5 px-4 py-2 hover:bg-surface-2", COLUMNS)}>
                <div className="row-span-2 flex min-w-0 items-center gap-3 md:row-span-1">
                  <Avatar name={c.full_name} size={32} />
                  <div className="min-w-0">
                    <Link href={`/crm/contactos/${c.id}`} className="block truncate text-sm font-medium text-foreground hover:text-brand">
                      {c.full_name}
                    </Link>
                    <p className="truncate text-xs text-muted">
                      {c.role_title ?? "Sin cargo"}
                      <span className="md:hidden">{c.company ? ` · ${c.company}` : ""}</span>
                    </p>
                  </div>
                </div>
                <p className="hidden truncate text-sm text-muted md:block">{c.company ?? "—"}</p>
                <span
                  className={cn(
                    "col-start-2 row-start-1 w-fit justify-self-end rounded-full border px-2 py-0.5 text-[11px] md:col-auto md:row-auto md:justify-self-start",
                    c.origin === "outbound" ? "border-aqua/30 bg-aqua/10 text-aqua" : "border-brand/30 bg-brand/10 text-brand",
                  )}
                >
                  {c.origin === "outbound" ? "Outbound" : "Inbound"}
                </span>
                <div className="col-start-2 row-start-2 flex items-center justify-end gap-2 md:col-auto md:row-auto">
                  
                  <TemperatureBadge value={c.qualification} reason={c.qualificationReason} updatedAt={c.qualifiedAt} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="px-1 text-xs text-muted-2">
        {visible.length} de {contacts.length} contactos
      </p>
    </div>
  );
}
