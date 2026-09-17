import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string; next?: string }>;
}) {
  const { error, notice, next } = await searchParams;

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
              <span className="ml-3 capsule-auth-prompt">capsule · acceso</span>
            </div>
            <div className="p-6">
              <p className="capsule-auth-prompt">
                <span className="text-lime">❯</span> iniciando sesión
              </p>
              <h1 className="mt-2 text-xl font-semibold">Ingresar</h1>
              <p className="mt-1 text-sm text-muted">Entrá con tu email y contraseña.</p>
              {notice && (
                <p className="mt-4 rounded-xl border border-lime/30 bg-lime/10 px-3 py-2 text-sm text-lime">
                  {notice}
                </p>
              )}
              {error && (
                <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                  {error}
                </p>
              )}
              <form action="/api/auth/login" method="post" className="mt-6 flex flex-col gap-4">
                <input type="hidden" name="next" value={next ?? "/dashboard"} />
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
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          ¿No tenés cuenta?{" "}
          <Link href="/signup" className="text-lime hover:underline">
            Creá una
          </Link>
        </p>
      </div>
    </main>
  );
}
