"use client";
import { useState, useTransition } from "react";
import { updateDealStage } from "@/app/(app)/crm/pipeline/actions";
export function DealStageSelect({ id, stage }: { id: string; stage: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  return <div className="mt-3">
    <label className="text-xs text-muted">Etapa
      <select aria-label="Cambiar etapa de la oportunidad" disabled={pending} value={stage} onChange={e => {
        const next = e.target.value;
        start(async () => { const result = await updateDealStage(id, next); setError(result.error ?? ""); });
      }} className="ml-2 max-w-full rounded-lg border border-surface-border bg-surface-2 p-1 text-xs">
        {[["contacto","Primer contacto"],["interes","Interés"],["reunion","Reunión"],["pedido","Primer pedido"],["cliente","Cliente activo"]].map(([value,label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </label>
    {error && <p role="alert" className="mt-1 text-xs text-danger">{error}</p>}
  </div>;
}
