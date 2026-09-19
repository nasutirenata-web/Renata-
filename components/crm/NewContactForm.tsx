"use client";

import { useState, useTransition } from "react";
import { createContact } from "@/app/(app)/crm/contactos/actions";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

const fieldClass =
  "rounded-xl border border-surface-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-brand";

// Carga manual: es la alternativa a Buscar prospectos, por eso el botón es secundario.
export function NewContactForm({ companies }: { companies: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
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
      className="flex w-full basis-full flex-wrap items-end gap-3 rounded-2xl border border-brand/20 bg-brand/[0.05] p-4"
    >
      <label className="flex flex-col gap-1 text-xs text-muted">
        Nombre
        <input name="full_name" required maxLength={120} className={fieldClass} placeholder="Nombre y apellido" />
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted">
        Cargo
        <input name="role_title" maxLength={120} className={fieldClass} placeholder="Directora de Marketing" />
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted">
        Empresa
        <select name="company_id" defaultValue="" className={fieldClass}>
          <option value="">Sin empresa</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted">
        Email (opcional)
        <input name="email" type="email" maxLength={200} className={fieldClass} placeholder="nombre@empresa.com" />
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted">
        Origen
        <select name="origin" defaultValue="outbound" className={fieldClass}>
          <option value="outbound">Outbound</option>
          <option value="inbound">Inbound</option>
        </select>
      </label>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Guardando…" : "Guardar contacto"}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
      {error && <p className="w-full text-xs text-danger">{error}</p>}
    </form>
  );
}
