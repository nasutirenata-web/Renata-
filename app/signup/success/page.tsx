import Link from "next/link";
import { cookies } from "next/headers";
import { LinkButton } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default async function SignupSuccessPage() {
  const cookieStore = await cookies();
  const word = cookieStore.get("signup_word")?.value;

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
              <span className="ml-3 capsule-auth-prompt">capsule · cuenta creada</span>
            </div>
            <div className="p-6">
              {word ? (
                <>
                  <h1 className="text-xl font-semibold">Guardá tu palabra de acceso</h1>
                  <p className="mt-1 text-sm text-muted">
                    Es tu contraseña: la vas a usar cada vez que quieras entrar. Solo la mostramos esta vez.
                  </p>
                  <div className="mt-6 rounded-xl border border-lime/30 bg-lime/10 px-4 py-4 text-center text-xl font-semibold uppercase tracking-wide text-lime">
                    {word}
                  </div>
                  <p className="mt-4 text-xs text-muted">
                    Si te pedimos confirmar tu email, hacelo primero y después iniciá sesión con esta palabra en la
                    pestaña &quot;Con contraseña&quot;.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-xl font-semibold">Cuenta creada</h1>
                  <p className="mt-1 text-sm text-muted">
                    Ya podés iniciar sesión. Si elegiste tu propia contraseña, usá esa.
                  </p>
                </>
              )}
              <LinkButton href="/login" className="mt-6 w-full">
                Ir a iniciar sesión
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
