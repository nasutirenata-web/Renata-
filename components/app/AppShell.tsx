import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import {
  LayoutDashboard,
  Building2,
  Users,
  KanbanSquare,
  Activity,
  Palette,
  Bot,
  Settings,
  CalendarDays,
  Search,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { section: "Outbound" },
  { href: "/prospeccion", label: "Prospección", icon: Search },
  { section: "CRM" },
  { href: "/crm/empresas", label: "Empresas", icon: Building2 },
  { href: "/crm/contactos", label: "Contactos", icon: Users },
  { href: "/crm/pipeline", label: "Pipeline", icon: KanbanSquare },
  { href: "/crm/actividad", label: "Actividad", icon: Activity },
  { section: "Studio" },
  { href: "/studio", label: "Herramientas", icon: Palette },
  { href: "/studio/calendario", label: "Calendario editorial", icon: CalendarDays },
  { section: "Asistente" },
  { href: "/chat", label: "Chat", icon: Bot },
  { section: "" },
  { href: "/configuracion/integraciones", label: "Configuración", icon: Settings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-surface-border/60 bg-surface/40 md:flex">
        <div className="px-6 py-6">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3">
          {nav.map((item, i) =>
            "section" in item ? (
              item.section ? (
                <p
                  key={`${item.section}-${i}`}
                  className="mb-1 mt-5 px-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-2 first:mt-0"
                >
                  {item.section}
                </p>
              ) : (
                <div key={`sep-${i}`} className="my-3 border-t border-surface-border/60" />
              )
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-surface-2 hover:text-lime"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="p-4">
          <div className="rounded-2xl border border-surface-border bg-surface-2 p-4 text-xs text-muted">
            Organización de demostración. Conectá Supabase en{" "}
            <Link href="/configuracion/integraciones" className="text-lime hover:underline">
              Configuración
            </Link>{" "}
            para persistir datos reales.
          </div>
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">{children}</div>
    </div>
  );
}
