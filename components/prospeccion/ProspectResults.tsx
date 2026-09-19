"use client";

import { useState, useTransition } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { saveProspectCompanies, type SaveResult } from "@/app/(app)/prospeccion/actions";
import { normalizeName } from "@/lib/crm-dedupe";
import { cn } from "@/lib/utils";

export type Prospecto = { nombre_hipotetico: string; razon: string };

type RowState = "saved" | "duplicate";

// Las empresas que devuelve la IA son ideas para investigar, no empresas encontradas: se marcan como
// "sin verificar", se eligen a mano y el resultado que se muestra es el que confirma el servidor.
export function ProspectResults({ results, origin }: { results: Prospecto[]; origin: "outbound" | "inbound" }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [rows, setRows] = useState<Record<number, RowState>>({});
  const [outcome, setOutcome] = useState<SaveResult | null>(null);
  const [pending, startTransition] = useTransition();

  const selectable = results.map((_, i) => i).filter((i) => !rows[i]);
  const allSelected = selectable.length > 0 && selectable.every((i) => selected.has(i));

  const toggle = (i: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  function save() {
    const indexes = [...selected].filter((i) => !rows[i]);
    if (indexes.length === 0) return;
    const names = indexes.map((i) => results[i].nombre_hipotetico);
    startTransition(async () => {
      const res = await saveProspectCompanies(names, origin).catch(
        (): SaveResult => ({ error: "No se pudo conectar con el servidor. No se guardó nada.", saved: [], duplicates: [] }),
      );
      setOutcome(res);
      if (res.error) return;
      const saved = new Set(res.saved.map(normalizeName));
      setRows((prev) => {
        const next = { ...prev };
        for (const i of indexes) next[i] = saved.has(normalizeName(results[i].nombre_hipotetico)) ? "saved" : "duplicate";
        return next;
      });
      setSelected(new Set());
    });
  }

  return (
    <section aria-label="Sugerencias de IA" className="glass-panel overflow-hidden rounded-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border/60 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {results.length} sugerencias de IA <span className="ml-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning">Sin verificar</span>
          </p>
          <p className="mt-0.5 text-xs text-muted">Son ideas para investigar, no empresas confirmadas. Verificalas antes de contactarlas.</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={allSelected}
            disabled={selectable.length === 0}
            onChange={() => setSelected(allSelected ? new Set() : new Set(selectable))}
            className="h-4 w-4 accent-brand"
          />
          Elegir todas
        </label>
      </div>

      <ul className="divide-y divide-surface-border/60">
        {results.map((p, i) => {
          const state = rows[i];
          return (
            <li key={i}>
              <label className={cn("flex items-start gap-3 px-4 py-2.5", state ? "opacity-70" : "cursor-pointer hover:bg-surface-2")}>
                <input
                  type="checkbox"
                  checked={selected.has(i)}
                  disabled={Boolean(state)}
                  onChange={() => toggle(i)}
                  className="mt-1 h-4 w-4 shrink-0 accent-brand"
                />
                <span className="min-w-0 flex-1">
                  <span className="block break-words text-sm font-medium text-foreground">{p.nombre_hipotetico}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted">{p.razon}</span>
                </span>
                {state && (
                  <span className="mt-0.5 flex shrink-0 items-center gap-1 text-xs text-muted">
                    <Check className="h-3.5 w-3.5" /> {state === "saved" ? "Guardada" : "Ya estaba en tu CRM"}
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-3 border-t border-surface-border/60 px-4 py-3">
        <Button size="sm" onClick={save} disabled={pending || selected.size === 0}>
          <Plus className="h-4 w-4" />
          {pending ? "Guardando…" : `Guardar ${selected.size || ""} en el CRM`.replace("  ", " ")}
        </Button>
        <div role="status" className="min-w-0 flex-1 text-xs">
          {outcome?.error && <p className="text-danger">{outcome.error}</p>}
          {outcome && !outcome.error && (
            <p className="text-muted">
              {outcome.saved.length > 0 && <span className="text-foreground">Guardadas en el CRM: {outcome.saved.join(", ")}. </span>}
              {outcome.duplicates.length > 0 && <span>Ya estaban, no se duplicaron: {outcome.duplicates.join(", ")}.</span>}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
