import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="capsule-auth-shell flex min-h-screen items-center justify-center bg-background px-5 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 flex justify-center">
          <Logo height={30} />
        </Link>
        <div className="capsule-auth-card">
          <div className="bg-surface">
            <div className="capsule-auth-bar">
              <span className="capsule-auth-dot" style={{ background: "#ef4444" }} />
              <span className="capsule-auth-dot" style={{ background: "#f59e0b" }} />
              <span className="capsule-auth-dot" style={{ background: "#d9f99b" }} />
              <span className="ml-3 capsule-auth-prompt">capsule · nueva cuenta</span>
            </div>
            <div className="p-6">
              <p className="capsule-auth-prompt">
                <span className="text-lime">❯</span> configurando tu espacio
              </p>
              <h1 className="mt-2 text-xl font-semibold">Crear cuenta</h1>
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
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-lime hover:underline">
            Ingresá
          </Link>
        </p>
      </div>
    </main>
  );
}
