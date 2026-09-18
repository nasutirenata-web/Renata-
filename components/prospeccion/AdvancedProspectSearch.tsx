"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search } from "lucide-react";
import { FilterGroup, FilterPanel, RadioOptions, pillField } from "@/components/ui/FilterPanel";
import { logSearch, addProspectToCrm } from "@/app/(app)/prospeccion/actions";
import { ProspectResults, type Prospecto, type Temp } from "@/components/prospeccion/ProspectResults";
import { cn } from "@/lib/utils";

type Origen = "outbound" | "inbound";

const SENIORITY = ["Founder / C-level", "Director", "Gerente", "Analista"].map((v) => ({ value: v, label: v }));
const TAMANOS = ["1-10 empleados", "11-50 empleados", "51-200 empleados", "201-500 empleados", "+500 empleados"].map((v) => ({ value: v, label: v }));

export function AdvancedProspectSearch() {
  const [segmento, setSegmento] = useState("");
  const [zona, setZona] = useState("");
  const [tamano, setTamano] = useState("");
  const [rol, setRol] = useState("");
  const [seniority, setSeniority] = useState("");
  const [industria, setIndustria] = useState("");
  const [tecnologia, setTecnologia] = useState("");
  const [senal, setSenal] = useState("");
  const [origen, setOrigen] = useState<Origen>("outbound");

  const [results, setResults] = useState<Prospecto[]>([]);
  const [temps, setTemps] = useState<Record<number, Temp>>({});
  const [added, setAdded] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const hasFilters = [segmento, zona, tamano, rol, seniority, industria, tecnologia, senal].some(Boolean);

  function clearFilters() {
    setSegmento("");
    setZona("");
    setTamano("");
    setRol("");
    setSeniority("");
    setIndustria("");
    setTecnologia("");
    setSenal("");
  }

  async function handleSearch() {
    setLoading(true);
    setNotice(null);
    setResults([]);
    setTemps({});
    setAdded({});
    setSearched(true);
    try {
      const res = await fetch("/api/ai/prospectar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segmento, zona, tamano, rol, seniority, industria, tecnologia, senal, origen }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.message ?? data.error ?? "No se pudo generar la lista.");
        return;
      }
      setResults(data.prospectos);
      startTransition(() => {
        logSearch(
          [segmento, zona, tamano, rol, seniority, industria, tecnologia, senal, origen]
            .filter(Boolean)
            .join(" · ") || "sin criterio",
          data.prospectos.length,
        );
      });
    } catch {
      setNotice("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd(i: number, name: string) {
    startTransition(async () => {
      const res = await addProspectToCrm(name, origen);
      if (!res?.error) setAdded((prev) => ({ ...prev, [i]: true }));
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <FilterPanel>
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-foreground">Filtros</p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-muted transition-colors hover:text-brand"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className="flex w-fit gap-1 rounded-full border border-surface-border bg-surface-2 p-1 text-sm">
          {(["outbound", "inbound"] as const).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOrigen(o)}
              className={cn(
                "rounded-full px-4 py-1.5 capitalize transition-colors",
                origen === o ? "capsule-button-primary" : "text-muted hover:text-foreground",
              )}
            >
              {o}
            </button>
          ))}
        </div>

        <div>
          <FilterGroup title="Puesto de trabajo" defaultOpen>
            <input
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              placeholder="Puesto (ej: dueño, compras)"
              className={pillField}
            />
            <RadioOptions options={SENIORITY} value={seniority} onChange={setSeniority} label="Seniority" />
          </FilterGroup>

          <FilterGroup title="Empresa" defaultOpen>
            <input
              value={segmento}
              onChange={(e) => setSegmento(e.target.value)}
              placeholder="Segmento / tipo de negocio"
              className={pillField}
            />
            <RadioOptions options={TAMANOS} value={tamano} onChange={setTamano} label="Tamaño de empresa" />
          </FilterGroup>

          <FilterGroup title="Ubicación">
            <input
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              placeholder="Ciudad o país"
              className={pillField}
            />
          </FilterGroup>

          <FilterGroup title="Sector y palabras clave">
            <input
              value={industria}
              onChange={(e) => setIndustria(e.target.value)}
              placeholder="Industria / sector"
              className={pillField}
            />
            <input
              value={tecnologia}
              onChange={(e) => setTecnologia(e.target.value)}
              placeholder="Tecnología que usarían"
              className={pillField}
            />
          </FilterGroup>

          <FilterGroup title="Señal de compra">
            <textarea
              value={senal}
              onChange={(e) => setSenal(e.target.value)}
              rows={3}
              placeholder="Por qué contactar ahora (ej: levantó ronda, cambió de proveedor)"
              className="w-full resize-none rounded-2xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </FilterGroup>
        </div>

        <Button className="w-full" onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4" /> {loading ? "Buscando…" : "Buscar"}
        </Button>
      </FilterPanel>

      <section className="flex min-w-0 flex-col gap-4">
        <div className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4">
          <p className="max-w-xl text-xs leading-relaxed text-muted">
            Combiná tantos filtros como necesites. Sin un proveedor de datos pago conectado, esto genera
            hipótesis con IA para investigar manualmente — no un resultado verificado.
          </p>
          <Badge tone="ok" className="shrink-0 normal-case">
            Gratis · sin créditos
          </Badge>
        </div>

        {notice && <p className="text-xs text-warning">{notice}</p>}

        {loading && <p className="px-2 text-sm text-muted">Buscando…</p>}

        {!loading && results.length > 0 && (
          <>
            <p className="px-2 text-xs uppercase tracking-wide text-muted-2">
              {results.length} hipótesis
            </p>
            <ProspectResults
              results={results}
              temps={temps}
              added={added}
              onTemp={(i, t) => setTemps((prev) => ({ ...prev, [i]: t }))}
              onAdd={handleAdd}
            />
          </>
        )}

        {!loading && results.length === 0 && !notice && (
          <EmptyState
            icon={Search}
            title={searched ? "Sin resultados" : "Elegí tus filtros y tocá Buscar"}
            body={
              searched
                ? "Probá con menos filtros o con criterios más generales."
                : "Podés usar un solo filtro o combinar varios: cuanto más específico, más afinada la lista."
            }
          />
        )}
      </section>
    </div>
  );
}
