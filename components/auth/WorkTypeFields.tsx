"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { WorkType } from "@/lib/profile";

const inputClass =
  "rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand";

const OPTIONS: { value: WorkType; label: string }[] = [
  { value: "empresa", label: "Trabajo en una empresa" },
  { value: "freelance", label: "Soy freelance" },
];

export function WorkTypeFields({
  defaults,
}: {
  defaults?: { work_type?: WorkType; company?: string; freelance_count?: string; freelance_names?: string };
}) {
  const [type, setType] = useState<WorkType>(defaults?.work_type ?? "empresa");

  return (
    <>
      <fieldset className="flex flex-col gap-2 text-sm">
        <legend className="mb-1.5">¿Cómo trabajás?</legend>
        <div className="flex flex-wrap gap-2">
          {OPTIONS.map((o) => (
            <label
              key={o.value}
              className={cn(
                "flex cursor-pointer items-center rounded-full border px-4 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand",
                type === o.value ? "border-brand bg-brand/10 text-brand" : "border-surface-border bg-surface-2 text-muted hover:text-foreground",
              )}
            >
              <input type="radio" name="work_type" value={o.value} checked={type === o.value} onChange={() => setType(o.value)} className="sr-only" />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      {type === "empresa" ? (
        <label className="flex flex-col gap-1.5 text-sm">
          Empresa
          <input type="text" name="company" required maxLength={120} defaultValue={defaults?.company} className={inputClass} placeholder="Nombre de tu empresa" />
        </label>
      ) : (
        <>
          <label className="flex flex-col gap-1.5 text-sm">
            ¿Con cuántas empresas trabajás? (opcional)
            <input type="number" name="freelance_count" min={0} max={999} inputMode="numeric" defaultValue={defaults?.freelance_count} className={inputClass} placeholder="Por ejemplo, 3" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Nombres de las empresas (opcional, separados por coma)
            <textarea name="freelance_names" rows={2} maxLength={500} defaultValue={defaults?.freelance_names} className={cn(inputClass, "resize-none")} />
          </label>
        </>
      )}
    </>
  );
}
