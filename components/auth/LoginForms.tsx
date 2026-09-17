"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

export function LoginForms({ next }: { next: string }) {
  const [mode, setMode] = useState<"code" | "password">("code");
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function requestCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "No pudimos enviar tu código. Probá de nuevo.");
        return;
      }
      setStep("code");
    } finally {
      setPending(false);
    }
  }

  async function verifyCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    const form = new FormData(e.currentTarget);
    const token = String(form.get("token") ?? "");
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Código inválido o vencido.");
        return;
      }
      window.location.href = data.next ?? next;
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex rounded-full border border-surface-border bg-surface-2 p-1 text-xs">
        <button
          type="button"
          onClick={() => {
            setMode("code");
            setStep("email");
            setMessage(null);
          }}
          className={`flex-1 rounded-full px-3 py-2 font-medium transition-colors ${
            mode === "code" ? "bg-lime text-lime-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          Palabra de acceso
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("password");
            setMessage(null);
          }}
          className={`flex-1 rounded-full px-3 py-2 font-medium transition-colors ${
            mode === "password" ? "bg-lime text-lime-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          Con contraseña
        </button>
      </div>

      {message && (
        <p className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {message}
        </p>
      )}

      {mode === "code" && step === "email" && (
        <form onSubmit={requestCode} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
              placeholder="vos@tuempresa.com"
            />
          </label>
          <Button type="submit" disabled={pending} className="mt-2 w-full">
            {pending ? "Enviando…" : "Enviarme la palabra"}
          </Button>
          <p className="text-center text-xs text-muted">
            Te lanzamos una palabra de marketing a tu email. La escribís acá mismo, sin salir del navegador.
          </p>
        </form>
      )}

      {mode === "code" && step === "code" && (
        <form onSubmit={verifyCode} className="flex flex-col gap-4">
          <p className="text-sm text-muted">
            Enviamos una palabra de marketing a <span className="text-foreground">{email}</span>.
          </p>
          <label className="flex flex-col gap-1.5 text-sm">
            Palabra de acceso
            <input
              type="text"
              name="token"
              required
              autoFocus
              autoCapitalize="characters"
              className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-center text-lg uppercase tracking-wide outline-none focus:border-lime"
              placeholder="EJ: FUNNEL-GROWTH"
            />
          </label>
          <Button type="submit" disabled={pending} className="mt-2 w-full">
            {pending ? "Confirmando…" : "Confirmar e ingresar"}
          </Button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setMessage(null);
            }}
            className="text-center text-xs text-muted hover:text-lime"
          >
            ‹ Usar otro email
          </button>
        </form>
      )}

      {mode === "password" && (
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
      )}
    </div>
  );
}
