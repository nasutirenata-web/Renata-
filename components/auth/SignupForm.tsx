"use client";

import { Button } from "@/components/ui/Button";

export function SignupForm() {
  return (
    <form action="/api/auth/signup" method="post" className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        Nombre
        <input
          type="text"
          name="full_name"
          required
          className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
          placeholder="Tu nombre"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        Empresa
        <input
          type="text"
          name="organization_name"
          required
          className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
          placeholder="Nombre de tu empresa"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        Email
        <input
          type="email"
          name="email"
          required
          className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
          placeholder="vos@tuempresa.com"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        Contraseña
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
          placeholder="Mínimo 8 caracteres"
        />
      </label>
      <Button type="submit" className="mt-2 w-full">
        Crear cuenta
      </Button>
    </form>
  );
}
