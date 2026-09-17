"use client";

import { useState, useTransition } from "react";
import { createContact } from "@/app/(app)/crm/contactos/actions";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export function NewContactForm({ origin }: { origin: "outbound" | "inbound" }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Nuevo contacto
      </Button>
    );
  }

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const res = await createContact(formData);
          if (res.error) setError(res.error);
          else setOpen(false);
        });
      }}
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-lime/20 bg-lime/[0.05] p-4"
    >
      <input type="hidden" name="origin" value={origin} />
      <label className="flex flex-col gap-1 text-xs text-muted">
        Nombre
        <input
          name="full_name"
          required
          className="rounded-xl border border-surface-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-lime"
          placeholder="Nombre y apellido"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted">
        Cargo
        <input
          name="role_title"
          className="rounded-xl border border-surface-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-lime"
          placeholder="Encargado de compras"
        />
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
