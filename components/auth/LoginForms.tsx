"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

// Solo se guarda el email en este navegador. La contraseña nunca se guarda acá:
// de eso se ocupa el administrador de contraseñas del navegador.
const REMEMBER_KEY = "capsule-remembered-account";

type Remembered = { remember: boolean; email?: string };

function readRemembered(): Remembered | null {
  try {
    const raw = localStorage.getItem(REMEMBER_KEY);
    return raw ? (JSON.parse(raw) as Remembered) : null;
  } catch {
    return null;
  }
}

export function LoginForms({ next, defaultEmail }: { next: string; defaultEmail?: string }) {
  const emailRef = useRef<HTMLInputElement>(null);
  const rememberRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = readRemembered();
    if (!saved) return;
    if (rememberRef.current) rememberRef.current.checked = saved.remember;
    if (saved.remember && saved.email && emailRef.current && !emailRef.current.value) {
      emailRef.current.value = saved.email;
    }
  }, []);

  function saveChoice() {
    try {
      const remember = rememberRef.current?.checked ?? false;
      const email = emailRef.current?.value.trim() ?? "";
      const value: Remembered = remember && email ? { remember: true, email } : { remember };
      localStorage.setItem(REMEMBER_KEY, JSON.stringify(value));
    } catch {
      // Sin almacenamiento disponible: el ingreso sigue funcionando igual.
    }
  }

  return (
    <form
      action="/api/auth/login"
      method="post"
      onSubmit={saveChoice}
      className="mt-6 flex flex-col gap-4"
    >
      <input type="hidden" name="next" value={next} />
      <label className="flex flex-col gap-1.5 text-sm">
        Email
        <input
          ref={emailRef}
          type="email"
          name="email"
          required
          autoComplete="username"
          defaultValue={defaultEmail}
          className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
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
          className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
          placeholder="••••••••"
        />
      </label>
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
        <input ref={rememberRef} type="checkbox" defaultChecked className="h-4 w-4 accent-brand" />
        Recordar mi cuenta en este dispositivo
      </label>
      <Button type="submit" className="mt-2 w-full">
        Ingresar
      </Button>
    </form>
  );
}
