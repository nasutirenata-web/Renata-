"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function SignupForm() {
  const [passwordMode, setPasswordMode] = useState<"generated" | "custom">("generated");

  return (
    <form action="/api/auth/signup" method="post" className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="password_mode" value={passwordMode} />
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

      <div className="flex rounded-full border border-surface-border bg-surface-2 p-1 text-xs">
        <button
          type="button"
          onClick={() => setPasswordMode("generated")}
          className={`flex-1 rounded-full px-3 py-2 font-medium transition-colors ${
            passwordMode === "generated" ? "bg-lime text-lime-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          Palabra clave
        </button>
        <button
          type="button"
          onClick={() => setPasswordMode("custom")}
          className={`flex-1 rounded-full px-3 py-2 font-medium transition-colors ${
            passwordMode === "custom" ? "bg-lime text-lime-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          Mi propia contraseña
        </button>
      </div>

      {passwordMode === "generated" ? (
        <p className="text-xs text-muted">
          Te generamos una palabra de marketing (ej. FUNNEL-GROWTH) para que uses como contraseña. La vas a ver una
          sola vez al terminar.
        </p>
      ) : (
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
      )}

      <Button type="submit" className="mt-2 w-full">
        Crear cuenta
      </Button>
    </form>
  );
}
