"use client";

import { useState, useTransition } from "react";
import { createDeal } from "@/app/(app)/crm/pipeline/actions";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

const stageOptions = [
  { value: "contacto", label: "Primer contacto" },
  { value: "interes", label: "Interés" },
  { value: "reunion", label: "Reunión" },
  { value: "pedido", label: "Primer pedido" },
  { value: "cliente", label: "Cliente activo" },
];

const fieldClass =
  "rounded-xl border border-surface-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-brand";

export function NewDealForm({ origin }: { origin: "outbound" | "inbound" }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Nueva oportunidad
      </Button>
    );
  }

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const res = await createDeal(formData);
          if (res.error) setError(res.error);
          else setOpen(false);
        });
      }}
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-brand/20 bg-brand/[0.05] p-4"
    >
      <input type="hidden" name="origin" value={origin} />
      <label className="flex flex-col gap-1 text-xs text-muted">
        Oportunidad
        <input name="title" required className={fieldClass} placeholder="Nombre de la cuenta o proyecto" />
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted">
        Etapa
        <select name="stage" defaultValue="contacto" className={fieldClass}>
          {stageOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted">
        Monto estimado (opcional)
        <input name="value" inputMode="decimal" className={fieldClass} placeholder="850000" />
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted">
        Moneda
        <select name="currency" defaultValue="USD" className={fieldClass}>
          <option value="USD">USD</option>
          <option value="ARS">ARS</option>
        </select>
      </label>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Guardando…" : "Guardar"}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
      {error && <p className="w-full text-xs text-danger">{error}</p>}
    </form>
  );
}
