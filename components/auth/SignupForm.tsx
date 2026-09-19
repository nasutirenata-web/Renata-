"use client";

import { Button } from "@/components/ui/Button";
import { WorkTypeFields } from "@/components/auth/WorkTypeFields";

const inputClass =
  "rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand";

export function SignupForm() {
  return (
    <form action="/api/auth/signup" method="post" className="mt-6 flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          Nombre
          <input type="text" name="first_name" required maxLength={60} autoComplete="given-name" className={inputClass} placeholder="Tu nombre" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Apellido
          <input type="text" name="last_name" required maxLength={60} autoComplete="family-name" className={inputClass} placeholder="Tu apellido" />
        </label>
      </div>
      <WorkTypeFields />
      <label className="flex flex-col gap-1.5 text-sm">
        Email
        <input type="email" name="email" required autoComplete="username" className={inputClass} placeholder="vos@tuempresa.com" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        Contraseña
        <input type="password" name="password" required minLength={8} autoComplete="new-password" className={inputClass} placeholder="Mínimo 8 caracteres" />
      </label>
      <Button type="submit" className="mt-2 w-full">
        Crear cuenta
      </Button>
    </form>
  );
}
