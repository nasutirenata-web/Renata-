import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { Building2, Plug, Activity, HeartPulse, Flag } from "lucide-react";

const nav = [
  { href: "/admin", label: "Workspaces", icon: Building2 },
  { href: "/admin/providers", label: "Providers", icon: Plug },
  { href: "/admin/uso", label: "Uso", icon: Activity },
  { href: "/admin/sistema", label: "System health", icon: HeartPulse },
  { href: "/admin/flags", label: "Feature flags", icon: Flag },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="capsule-sidebar hidden w-64 shrink-0 flex-col border-r border-surface-border/60 bg-surface/40 md:flex">
        <div className="flex flex-col gap-2 px-6 py-6">
          <Link href="/">
            <Logo />
          </Link>
          <Badge tone="warning" className="w-fit">
            Panel interno
          </Badge>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-surface-2 hover:text-brand"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <div className="rounded-2xl border border-surface-border bg-surface-2 p-4 text-xs text-muted">
            Visible solo para dueños y socios de Capsule GTM. Los clientes no ven
            esta sección ni pueden acceder a otros workspaces.
          </div>
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">{children}</div>
    </div>
  );
}
