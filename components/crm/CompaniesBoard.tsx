"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { FilterGroup, FilterPanel, RadioOptions, pillField } from "@/components/ui/FilterPanel";
import { formatDate } from "@/lib/utils";

export type BoardCompany = {
  id: string;
  name: string;
  segment: string | null;
  origin: string;
  created_at: string;
};

export function CompaniesBoard({ companies }: { companies: BoardCompany[] }) {
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("");

  const segmentOptions = useMemo(
    () =>
      Array.from(new Set(companies.map((c) => c.segment).filter((s): s is string => Boolean(s))))
        .slice(0, 8)
        .map((s) => ({ value: s, label: s })),
    [companies],
  );

  const q = query.trim().toLowerCase();
  const visible = companies.filter(
    (c) =>
      (!segment || c.segment === segment) &&
      (!q || c.name.toLowerCase().includes(q) || (c.segment ?? "").toLowerCase().includes(q)),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <FilterPanel>
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-foreground">Filtros</p>
          {(query || segment) && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSegment("");
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
            placeholder="Nombre o segmento"
            aria-label="Buscar empresas"
            className={pillField + " pl-10"}
          />
        </div>
        {segmentOptions.length > 0 && (
          <FilterGroup title="Segmento" defaultOpen>
            <RadioOptions options={segmentOptions} value={segment} onChange={setSegment} label="Segmento" />
          </FilterGroup>
        )}
      </FilterPanel>

      <section className="flex min-w-0 flex-col gap-3">
        <p className="px-4 text-xs text-muted-2">
          {visible.length} de {companies.length} empresas
        </p>
        {visible.length === 0 && (
          <p className="glass-panel rounded-2xl px-5 py-6 text-center text-sm text-muted">
            Ninguna empresa coincide con estos filtros.
          </p>
        )}
        {visible.map((c) => (
          <div
            key={c.id}
            className="lead-row flex items-center justify-between gap-3 rounded-2xl p-3 sm:p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="lead-avatar hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-brand sm:flex"
                aria-hidden="true"
              >
                {c.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-foreground">{c.name}</p>
                <p className="mt-1 break-words text-xs text-muted">
                  {c.segment ? c.segment + " · " : ""}Creada {formatDate(c.created_at)}
                </p>
              </div>
            </div>
            <Badge tone="brand" className="shrink-0">
              {c.origin}
            </Badge>
          </div>
        ))}
      </section>
    </div>
  );
}
