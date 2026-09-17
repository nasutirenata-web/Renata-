import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { LoginForms } from "@/components/auth/LoginForms";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string; next?: string; email?: string }>;
}) {
  const { error, notice, next, email } = await searchParams;
  const resolvedNext = next ?? "/dashboard";

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
              <span className="ml-3 capsule-auth-prompt">capsule · acceso</span>
            </div>
            <div className="p-7 sm:p-8">
              <p className="capsule-auth-prompt">
                <span className="text-brand">❯</span> tu espacio de trabajo
              </p>
              <h1 className="mt-2 text-xl font-semibold">Ingresar</h1>
              <p className="mt-1 text-sm text-muted">Entrá con tu email y contraseña.</p>
              {notice && (
                <p className="mt-4 rounded-xl border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-brand">
                  {notice}
                </p>
              )}
              {error && (
                <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                  {error}{" "}
                  <Link href="/forgot-password" className="underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </p>
              )}
              <LoginForms next={resolvedNext} defaultEmail={email} />
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          ¿No tenés cuenta?{" "}
          <Link href="/signup" className="text-brand hover:underline">
            Creá una
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-muted">
          <Link href="/forgot-password" className="text-brand hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </div>
    </main>
  );
}
