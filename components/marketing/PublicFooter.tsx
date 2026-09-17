import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";

export function PublicFooter() {
  return (
    <footer className="border-t border-surface-border/60 py-10">
      <Container className="flex flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <Logo />
        <p>Estrategia, datos y ejecución comercial B2B, conectados en un solo sistema.</p>
        <p>© {new Date().getFullYear()} Capsule GTM</p>
      </Container>
    </footer>
  );
}
