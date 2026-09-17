import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SignupForm } from "@/components/auth/SignupForm";

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
              <SignupForm />
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
