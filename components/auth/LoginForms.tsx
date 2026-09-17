"use client";

import { Button } from "@/components/ui/Button";

export function LoginForms({ next, defaultEmail }: { next: string; defaultEmail?: string }) {
  return (
    <form action="/api/auth/login" method="post" className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <label className="flex flex-col gap-1.5 text-sm">
        Email
        <input
          type="email"
          name="email"
          required
          defaultValue={defaultEmail}
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
          autoComplete="current-password"
          className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
          placeholder="••••••••"
        />
      </label>
      <Button type="submit" className="mt-2 w-full">
        Ingresar
      </Button>
    </form>
  );
}
