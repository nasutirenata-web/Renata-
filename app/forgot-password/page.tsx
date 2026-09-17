import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="capsule-auth-shell flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex justify-center">
          <Logo height={68} />
        </Link>
        <div className="capsule-auth-card">
          <div className="bg-transparent">
            <div className="capsule-auth-bar">
              <span className="capsule-auth-dot" />
              <span className="capsule-auth-dot" />
              <span className="capsule-auth-dot" />
              <span className="ml-3 capsule-auth-prompt">capsule · recuperar acceso</span>
            </div>
            <div className="p-7 sm:p-8">
              <p className="capsule-auth-prompt">
                <span className="text-brand">❯</span> restablecer contraseña
              </p>
              <h1 className="mt-2 text-xl font-semibold">Olvidaste tu contraseña</h1>
              <p className="mt-1 text-sm text-muted">
                Escribí tu email y te mandamos un link para elegir una nueva.
              </p>
              {error && (
                <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                  {error}
                </p>
              )}
              <form action="/api/auth/forgot-password" method="post" className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5 text-sm">
                  Email
                  <input
                    type="email"
                    name="email"
                    required
                    className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
                    placeholder="vos@tuempresa.com"
                  />
                </label>
                <Button type="submit" className="mt-2 w-full">
                  Enviar link de recuperación
                </Button>
              </form>
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/login" className="text-brand hover:underline">
            Volver a ingresar
          </Link>
        </p>
      </div>
    </main>
  );
}
