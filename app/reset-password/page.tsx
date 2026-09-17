import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export default async function ResetPasswordPage({
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
              <span className="ml-3 capsule-auth-prompt">capsule · nueva contraseña</span>
            </div>
            <div className="p-7 sm:p-8">
              <p className="capsule-auth-prompt">
                <span className="text-brand">❯</span> elegí tu nueva contraseña
              </p>
              <h1 className="mt-2 text-xl font-semibold">Nueva contraseña</h1>
              <p className="mt-1 text-sm text-muted">Guardala en tu gestor de contraseñas para no volver a perderla.</p>
              {error && (
                <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                  {error}
                </p>
              )}
              <form action="/api/auth/reset-password" method="post" className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5 text-sm">
                  Contraseña nueva
                  <input
                    type="password"
                    name="password"
                    required
                    autoComplete="new-password"
                    className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
                    placeholder="••••••••"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  Repetí la contraseña
                  <input
                    type="password"
                    name="confirm_password"
                    required
                    autoComplete="new-password"
                    className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
                    placeholder="••••••••"
                  />
                </label>
                <Button type="submit" className="mt-2 w-full">
                  Guardar contraseña
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
