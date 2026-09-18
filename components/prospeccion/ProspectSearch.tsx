"use client";

import { useState, useTransition } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search, Plus, Check } from "lucide-react";
import { logSearch, addProspectToCrm } from "@/app/(app)/prospeccion/actions";
import { cn } from "@/lib/utils";

type Prospecto = { nombre_hipotetico: string; razon: string };
type Temp = "cold" | "warm" | "hot";

const TEMPS: { value: Temp; className: string; label: string }[] = [
  { value: "cold", className: "bg-temp-cold", label: "Frío" },
  { value: "warm", className: "bg-temp-warm", label: "Tibio" },
  { value: "hot", className: "bg-temp-hot", label: "Caliente" },
];

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
            className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <input
            value={zona}
            onChange={(e) => setZona(e.target.value)}
            placeholder="Ciudad o país"
            className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <input
            value={tamano}
            onChange={(e) => setTamano(e.target.value)}
            placeholder="Tamaño estimado"
            className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <input
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            placeholder="Rol del contacto (ej: dueño, gerente)"
            className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <select
            value={origen}
            onChange={(e) => setOrigen(e.target.value as Origen)}
            className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
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
        <div className="overflow-hidden rounded-3xl border border-surface-border">
          <table className="w-full text-sm">
            <thead className="bg-surface/60 text-left text-xs uppercase tracking-wide text-muted-2">
              <tr>
                <th className="px-4 py-3 font-medium">Hipótesis</th>
                <th className="px-4 py-3 font-medium">Por qué encajaría</th>
                <th className="px-4 py-3 font-medium">Temperatura</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {results.map((p, i) => (
                <tr key={i} className="bg-surface/30">
                  <td className="px-4 py-3 font-medium text-foreground">{p.nombre_hipotetico}</td>
                  <td className="px-4 py-3 text-muted">{p.razon}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {TEMPS.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          title={t.label}
                          onClick={() => setTemps((prev) => ({ ...prev, [i]: t.value }))}
                          className={cn(
                            "h-5 w-5 rounded-md border-2 transition-transform hover:scale-110",
                            t.className,
                            temps[i] === t.value ? "border-white" : "border-transparent opacity-40",
                          )}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant={added[i] ? "ghost" : "secondary"}
                      disabled={added[i]}
                      onClick={() => handleAdd(i, p.nombre_hipotetico)}
                    >
                      {added[i] ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Agregada
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" /> Agregar al CRM
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
