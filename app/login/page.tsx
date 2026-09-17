import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-grid px-5 py-16">
      <Card className="w-full max-w-sm">
        <Link href="/" className="mb-8 inline-flex">
          <Logo />
        </Link>
        <h1 className="text-xl font-semibold">Ingresar</h1>
        <p className="mt-1 text-sm text-muted">Entrá con tu email y contraseña.</p>
        <form action="/api/auth/login" method="post" className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            Email
            <input
              type="email"
              name="email"
              required
              className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
              placeholder="vos@varowa.com"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Contraseña
            <input
              type="password"
              name="password"
              required
              className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
              placeholder="••••••••"
            />
          </label>
          <Button type="submit" className="mt-2 w-full">
            Ingresar
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          ¿No tenés cuenta?{" "}
          <Link href="/signup" className="text-lime hover:underline">
            Creá una
          </Link>
        </p>
      </Card>
    </main>
  );
}
