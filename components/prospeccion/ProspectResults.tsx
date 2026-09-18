"use client";

import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type Prospecto = { nombre_hipotetico: string; razon: string };
export type Temp = "cold" | "warm" | "hot";

const TEMPS: { value: Temp; className: string; label: string }[] = [
  { value: "cold", className: "bg-temp-cold", label: "Frío" },
  { value: "warm", className: "bg-temp-warm", label: "Tibio" },
  { value: "hot", className: "bg-temp-hot", label: "Caliente" },
];

export function ProspectResults({
  results,
  temps,
  added,
  onTemp,
  onAdd,
}: {
  results: Prospecto[];
  temps: Record<number, Temp>;
  added: Record<number, boolean>;
  onTemp: (index: number, temp: Temp) => void;
  onAdd: (index: number, name: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {results.map((p, i) => (
        <div
          key={i}
          className="lead-row flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-start gap-3">
            <span
              className="lead-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-brand"
              aria-hidden="true"
            >
              {p.nombre_hipotetico.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="break-words text-sm font-semibold text-foreground">{p.nombre_hipotetico}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{p.razon}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <div className="flex items-center gap-2" role="group" aria-label="Temperatura">
              {TEMPS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  title={t.label}
                  aria-label={t.label}
                  aria-pressed={temps[i] === t.value}
                  onClick={() => onTemp(i, t.value)}
                  className={cn(
                    "h-4 w-4 rounded-full shadow-[inset_0_1px_2px_#ffffffe0,0_1px_2px_#62527b30] transition-transform hover:scale-110",
                    t.className,
                    temps[i] === t.value ? "ring-2 ring-white ring-offset-1 ring-offset-transparent" : "opacity-50",
                  )}
                />
              ))}
            </div>
            <Button
              size="sm"
              variant={added[i] ? "ghost" : "secondary"}
              disabled={added[i]}
              onClick={() => onAdd(i, p.nombre_hipotetico)}
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
          </div>
        </div>
      ))}
    </div>
  );
}
