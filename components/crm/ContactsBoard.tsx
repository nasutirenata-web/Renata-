"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { FilterGroup, FilterPanel, RadioOptions, pillField } from "@/components/ui/FilterPanel";
import { TemperaturePicker } from "@/components/crm/TemperaturePicker";
import type { Temperature } from "@/components/crm/TemperatureControl";

export type BoardContact = {
  id: string;
  full_name: string;
  role_title: string | null;
  temperature: Temperature;
};

const TEMP_OPTIONS = [
  { value: "hot", label: "Caliente", dotClass: "bg-temp-hot" },
  { value: "warm", label: "Tibio", dotClass: "bg-temp-warm" },
  { value: "cold", label: "Frío", dotClass: "bg-temp-cold" },
];

export function ContactsBoard({ contacts }: { contacts: BoardContact[] }) {
  const [query, setQuery] = useState("");
  const [temp, setTemp] = useState("");

  const q = query.trim().toLowerCase();
  const visible = contacts.filter(
    (c) =>
      (!temp || c.temperature === temp) &&
      (!q || c.full_name.toLowerCase().includes(q) || (c.role_title ?? "").toLowerCase().includes(q)),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <FilterPanel>
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-foreground">Filtros</p>
          {(query || temp) && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setTemp("");
              }}
              className="text-xs text-muted transition-colors hover:text-brand"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre o cargo"
            aria-label="Buscar contactos"
            className={pillField + " pl-10"}
          />
        </div>
        <FilterGroup title="Temperatura" defaultOpen>
          <RadioOptions options={TEMP_OPTIONS} value={temp} onChange={setTemp} label="Temperatura" />
        </FilterGroup>
      </FilterPanel>

      <section className="flex min-w-0 flex-col gap-3">
        <div className="flex justify-between px-4 text-xs text-muted-2">
          <span>
            {visible.length} de {contacts.length} leads
          </span>
          <span>Temperatura</span>
        </div>
        {visible.length === 0 && (
          <p className="glass-panel rounded-2xl px-5 py-6 text-center text-sm text-muted">
            Ningún contacto coincide con estos filtros.
          </p>
        )}
        {visible.map((c) => (
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
      </section>
    </div>
  );
}
