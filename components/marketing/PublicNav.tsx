import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { LinkButton } from "@/components/ui/Button";

const links = [
  { href: "#sistema", label: "El sistema" },
  { href: "#incluye", label: "Qué incluye" },
  { href: "#plataforma", label: "Plataforma" },
  { href: "#precios", label: "Precios" },
];

export function PublicNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/[0.03] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" aria-label="Capsule GTM — inicio">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LinkButton href="/login" variant="ghost" size="sm">
            Ingresar
          </LinkButton>
          <LinkButton href="/signup" variant="primary" size="sm">
            Crear cuenta
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
