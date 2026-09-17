import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-grid px-5 py-16">
      <Card className="w-full max-w-sm">
        <Link href="/" className="mb-8 inline-flex">
          <Logo />
        </Link>
        <h1 className="text-xl font-semibold">Crear cuenta</h1>
        <p className="mt-1 text-sm text-muted">
          Probá el CRM, el Studio y el chat de Capsule GTM.
        </p>
        {error && (
          <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
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
              defaultValue="Varowa"
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
              placeholder="vos@varowa.com"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Contraseña
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
              placeholder="Mínimo 8 caracteres"
            />
          </label>
          <Button type="submit" className="mt-2 w-full">
            Crear cuenta
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-lime hover:underline">
            Ingresá
          </Link>
        </p>
      </Card>
    </main>
  );
}
