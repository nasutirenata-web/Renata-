import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/configuracion/perfil", label: "Mi perfil" },
  { href: "/configuracion/integraciones", label: "Integraciones" },
];

export function ConfigTabs({ active }: { active: string }) {
  return (
    <nav aria-label="Secciones de Configuración" className="workspace-tabs flex gap-2 overflow-x-auto px-5 pt-4 md:px-8">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.href === active ? "page" : undefined}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-xs transition-all",
            tab.href === active ? "capsule-nav-active border-white" : "border-white/65 bg-white/20 text-muted hover:bg-white/50",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
