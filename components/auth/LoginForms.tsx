"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function LoginForms({ next }: { next: string }) {
  const [mode, setMode] = useState<"word" | "password">("word");

  return (
    <div className="mt-6">
      <div className="mb-4 flex rounded-full border border-surface-border bg-surface-2 p-1 text-xs">
        <button
          type="button"
          onClick={() => setMode("word")}
          className={`flex-1 rounded-full px-3 py-2 font-medium transition-colors ${
            mode === "word" ? "bg-lime text-lime-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          Palabra de acceso
        </button>
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`flex-1 rounded-full px-3 py-2 font-medium transition-colors ${
            mode === "password" ? "bg-lime text-lime-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          Con contraseña
        </button>
      </div>

      <form action="/api/auth/login" method="post" className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />
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
          {mode === "word" ? "Palabra de acceso" : "Contraseña"}
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
            placeholder={mode === "word" ? "EJ: FUNNEL-GROWTH" : "••••••••"}
          />
        </label>
        <Button type="submit" className="mt-2 w-full">
          Ingresar
        </Button>
      </form>
    </div>
  );
}
