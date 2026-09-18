"use client";

import { useState, useTransition } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search, Plus, Check, ChevronDown, Briefcase, Building2, MapPin, Tags, Zap } from "lucide-react";
import { logSearch, addProspectToCrm } from "@/app/(app)/prospeccion/actions";
import { cn } from "@/lib/utils";

type Prospecto = { nombre_hipotetico: string; razon: string };
type Temp = "cold" | "warm" | "hot";
type Origen = "outbound" | "inbound";

const TEMPS: { value: Temp; className: string; label: string }[] = [
  { value: "cold", className: "bg-muted-2", label: "Frío" },
  { value: "warm", className: "bg-aqua-bright", label: "Tibio" },
  { value: "hot", className: "bg-brand-dim", label: "Caliente" },
];

function FilterSection({
  icon: Icon,
  title,
  defaultOpen,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-2/60">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium"
      >
        <span className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-brand" /> {title}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-2 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2">{children}</div>}
    </div>
  );
}

const fieldClass =
  "rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand";

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
        body: JSON.stringify({
          segmento,
          zona,
          tamano,
          rol,
          seniority,
          industria,
          tecnologia,
          senal,
          origen,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.message ?? "No se pudo generar la lista.");
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
    <>
      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Búsqueda avanzada</CardTitle>
            <CardDescription className="mt-1">
              Combiná tantos filtros como necesites, como en Apollo o Clay. Sin un proveedor
              de datos pago conectado, esto genera hipótesis con IA para investigar
              manualmente — no un resultado verificado.
            </CardDescription>
          </div>
          <Badge tone="ok" className="shrink-0 normal-case">
            Gratis · sin créditos
          </Badge>
        </div>

        <div className="flex gap-1 rounded-full border border-surface-border bg-surface-2 p-1 text-sm w-fit">
          <button
            type="button"
            onClick={() => setOrigen("outbound")}
            className={cn(
              "rounded-full px-4 py-1.5 transition-colors",
              origen === "outbound" ? "capsule-button-primary" : "text-muted hover:text-foreground",
            )}
          >
            Outbound
          </button>
          <button
            type="button"
            onClick={() => setOrigen("inbound")}
            className={cn(
              "rounded-full px-4 py-1.5 transition-colors",
              origen === "inbound" ? "capsule-button-primary" : "text-muted hover:text-foreground",
            )}
          >
            Inbound
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <FilterSection icon={Briefcase} title="Puesto de trabajo" defaultOpen>
            <input
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              placeholder="Puesto (ej: dueño, gerente de compras)"
              className={fieldClass}
            />
            <input
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
              placeholder="Seniority (ej: founder, director, analista)"
              className={fieldClass}
            />
          </FilterSection>

          <FilterSection icon={Building2} title="Empresa" defaultOpen>
            <input
              value={segmento}
              onChange={(e) => setSegmento(e.target.value)}
              placeholder="Segmento / tipo de negocio"
              className={fieldClass}
            />
            <input
              value={tamano}
              onChange={(e) => setTamano(e.target.value)}
              placeholder="Tamaño (ej: 10-50 empleados)"
              className={fieldClass}
            />
          </FilterSection>

          <FilterSection icon={MapPin} title="Ubicación">
            <input
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              placeholder="Ciudad o país"
              className={cn(fieldClass, "sm:col-span-2")}
            />
          </FilterSection>

          <FilterSection icon={Tags} title="Sector y palabras clave">
            <input
              value={industria}
              onChange={(e) => setIndustria(e.target.value)}
              placeholder="Industria / sector"
              className={fieldClass}
            />
            <input
              value={tecnologia}
              onChange={(e) => setTecnologia(e.target.value)}
              placeholder="Tecnología o herramientas que usarían"
              className={fieldClass}
            />
          </FilterSection>

          <FilterSection icon={Zap} title="Señal de compra">
            <textarea
              value={senal}
              onChange={(e) => setSenal(e.target.value)}
              rows={2}
              placeholder="Por qué contactar ahora (ej: levantó ronda, publicó una búsqueda laboral, cambió de proveedor)"
              className={cn(fieldClass, "sm:col-span-2 resize-none")}
            />
          </FilterSection>
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
