"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { WorkTypeFields } from "@/components/auth/WorkTypeFields";
import { updateProfile, type ProfileState } from "@/app/(app)/configuracion/perfil/actions";
import type { WorkType } from "@/lib/profile";

const inputClass =
  "rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand";

export function ProfileForm({
  defaults,
  email,
}: {
  defaults: { first_name: string; last_name: string; work_type: WorkType; company: string; freelance_count: string; freelance_names: string };
  email: string;
}) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfile, { status: "idle", message: "" });

  return (
    <form action={action} className="glass-panel flex max-w-xl flex-col gap-4 rounded-3xl p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          Nombre
          <input type="text" name="first_name" required maxLength={60} defaultValue={defaults.first_name} autoComplete="given-name" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Apellido
          <input type="text" name="last_name" required maxLength={60} defaultValue={defaults.last_name} autoComplete="family-name" className={inputClass} />
        </label>
      </div>
      <WorkTypeFields defaults={defaults} />
      <p className="text-xs text-muted-2">
        Email de la cuenta: {email}. Para cambiarlo hace falta un paso de verificación que todavía no está disponible acá.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>{pending ? "Guardando…" : "Guardar perfil"}</Button>
        <p role="status" className={state.status === "error" ? "text-sm text-danger" : "text-sm text-muted"}>{state.message}</p>
      </div>
    </form>
  );
}
