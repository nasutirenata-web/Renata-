"use client";

import { useState, useTransition } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import { logSearch, addProspectToCrm } from "@/app/(app)/prospeccion/actions";
import { ProspectResults, type Prospecto, type Temp } from "@/components/prospeccion/ProspectResults";

type Origen = "outbound" | "inbound";

export function ProspectSearch() {
  const [segmento, setSegmento] = useState("");
  const [zona, setZona] = useState("");
  const [tamano, setTamano] = useState("");
  const [rol, setRol] = useState("");
  const [origen, setOrigen] = useState<Origen>("outbound");
  const [results, setResults] = useState<Prospecto[]>([]);
  const [temps, setTemps] = useState<Record<number, Temp>>({});
  const [added, setAdded] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleSearch() {
    setLoading(true);
    setNotice(null);
    setResults([]);
    setTemps({});
    setAdded({});
    try {
      const res = await fetch("/api/ai/prospectar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segmento, zona, tamano, rol, origen }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.message ?? "No se pudo generar la lista.");
        return;
      }
      setResults(data.prospectos);
      startTransition(() => {
        logSearch(
          [segmento, zona, tamano, rol, origen === "inbound" ? "inbound" : "outbound"]
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
    <>
      <Card className="flex flex-col gap-4">
        <CardTitle>Buscar prospectos</CardTitle>
        <CardDescription>
          Definí el criterio de búsqueda. Sin un proveedor de datos conectado, esto
          genera una lista sugerida por IA para investigar manualmente — no un
          resultado verificado.
        </CardDescription>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            value={segmento}
            onChange={(e) => setSegmento(e.target.value)}
            placeholder="Segmento (ej: comercio de barrio)"
            className="w-full rounded-full border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <input
            value={zona}
            onChange={(e) => setZona(e.target.value)}
            placeholder="Ciudad o país"
            className="w-full rounded-full border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <input
            value={tamano}
            onChange={(e) => setTamano(e.target.value)}
            placeholder="Tamaño estimado"
            className="w-full rounded-full border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <input
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            placeholder="Rol del contacto (ej: dueño, gerente)"
            className="w-full rounded-full border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <select
            value={origen}
            onChange={(e) => setOrigen(e.target.value as Origen)}
            className="w-full rounded-full border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
          >
            <option value="outbound">Outbound</option>
            <option value="inbound">Inbound</option>
          </select>
        </div>
        <Button size="sm" className="w-fit" onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4" /> {loading ? "Buscando…" : "Buscar"}
        </Button>
        {notice && <p className="text-xs text-warning">{notice}</p>}
      </Card>

      {results.length > 0 && (
        <ProspectResults
          results={results}
          temps={temps}
          added={added}
          onTemp={(i, t) => setTemps((prev) => ({ ...prev, [i]: t }))}
          onAdd={handleAdd}
        />
      )}
    </>
  );
}
