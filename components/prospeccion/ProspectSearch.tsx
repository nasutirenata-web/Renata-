"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import { logSearch } from "@/app/(app)/prospeccion/actions";
import { ProspectResults, type Prospecto } from "@/components/prospeccion/ProspectResults";

type Origen = "outbound" | "inbound";

export function ProspectSearch() {
  const [segmento, setSegmento] = useState("");
  const [zona, setZona] = useState("");
  const [tamano, setTamano] = useState("");
  const [rol, setRol] = useState("");
  const [origen, setOrigen] = useState<Origen>("outbound");
  const [results, setResults] = useState<Prospecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/strategy", { signal: controller.signal }).then(async response => {
      if (!response.ok) return;
      const data = await response.json();
      const segment = data.sections?.["/build/icp:Segmentación"]?.values;
      const person = data.sections?.["/build/icp:Perfil del decisor"]?.values;
      if (segment?._reviewed === "true") { setSegmento(v => v || segment.segmento || ""); setZona(v => v || segment.geografia || ""); setTamano(v => v || segment.tamano || ""); }
      if (person?._reviewed === "true") setRol(v => v || person.decisor || "");
    }).catch(() => {});
    return () => controller.abort();
  }, []);

  async function handleSearch() {
    setLoading(true);
    setNotice(null);
    setResults([]);
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
            placeholder="Segmento (ej: software B2B, agencias)"
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
        <ProspectResults key={results.map((r) => r.nombre_hipotetico).join("|")} results={results} origin={origen} />
      )}
    </>
  );
}
