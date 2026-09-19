"use client";
import { useState, useTransition } from "react";
import { recordContactSignal } from "@/app/(app)/crm/contactos/actions";
import { SIGNALS } from "@/lib/qualification-rules";
import { Button } from "@/components/ui/Button";
export function RecordSignal({ contactId }: { contactId: string }) {
  const [pending, start] = useTransition();
  const [notice, setNotice] = useState("");
  return <details className="glass-panel rounded-2xl p-4">
    <summary className="cursor-pointer text-sm font-medium">Registrar una interacción que ocurrió fuera de Capsule</summary>
    <p className="my-3 text-xs text-muted">El semáforo se calcula con las interacciones registradas. Email, LinkedIn y WhatsApp todavía necesitan una integración para recibir sus respuestas automáticamente.</p>
    <form action={form => start(async () => {
      setNotice("");
      const result = await recordContactSignal(contactId, String(form.get("signal")));
      setNotice(result.error ?? "Interacción guardada. El semáforo se actualizó automáticamente.");
    })} className="flex flex-wrap items-center gap-3">
      <label className="text-xs">Qué ocurrió
        <select name="signal" required disabled={pending} defaultValue="" className="ml-2 rounded-xl border border-surface-border bg-surface-2 p-2 text-sm">
          <option value="" disabled>Elegí una interacción real</option>
          {Object.entries(SIGNALS).map(([key, signal]) => <option key={key} value={key}>{signal.label}</option>)}
        </select>
      </label>
      <Button size="sm" disabled={pending}>{pending ? "Registrando…" : "Registrar interacción"}</Button>
      <p role="status" className="w-full text-xs text-muted">{notice}</p>
    </form>
  </details>;
}
