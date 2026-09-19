"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Gauge, KanbanSquare, MessagesSquare, Palette, Search, Target, Users, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LinkButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  ContactosDemo, EstrategiaDemo, KpiDemo, MensajesDemo, PipelineDemo, ProspeccionDemo, StudioDemo,
  type ViewProps,
} from "@/components/demo/DemoViews";

const VIEWS = [
  { id: "kpis", label: "Medidor de KPIs", caption: "Métricas", icon: Gauge },
  { id: "estrategia", label: "Estrategia", caption: "Build", icon: Target },
  { id: "prospeccion", label: "Prospección", caption: "Outbound", icon: Search },
  { id: "contactos", label: "Contactos", caption: "CRM", icon: Users },
  { id: "pipeline", label: "Pipeline", caption: "CRM", icon: KanbanSquare },
  { id: "studio", label: "Studio y LinkedIn", caption: "Contenido", icon: Palette },
  { id: "mensajes", label: "Mensajes", caption: "Equipo", icon: MessagesSquare },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

const isViewId = (value?: string): value is ViewId => VIEWS.some((v) => v.id === value);

function renderView(id: ViewId, props: ViewProps) {
  switch (id) {
    case "kpis": return <KpiDemo />;
    case "estrategia": return <EstrategiaDemo {...props} />;
    case "prospeccion": return <ProspeccionDemo {...props} />;
    case "contactos": return <ContactosDemo />;
    case "pipeline": return <PipelineDemo {...props} />;
    case "studio": return <StudioDemo {...props} />;
    case "mensajes": return <MensajesDemo {...props} />;
  }
}

export function DemoApp({ initial }: { initial?: string }) {
  const [view, setView] = useState<ViewId>(isViewId(initial) ? initial : "kpis");
  const [locked, setLocked] = useState<string | null>(null);

  // El aviso se cierra solo a los 7 segundos; cada acción nueva reinicia la cuenta.
  useEffect(() => {
    if (!locked) return;
    const timer = setTimeout(() => setLocked(null), 7000);
    return () => clearTimeout(timer);
  }, [locked]);

  const onLocked = (action: string) => setLocked(action);

  function select(id: ViewId) {
    setView(id);
    window.history.replaceState(null, "", `/demo?vista=${id}`);
  }

  return (
    <div className="capsule-app min-h-screen">
      <header className="capsule-nav sticky top-0 z-40">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <Link href="/" aria-label="Capsule GTM, ir al inicio"><Logo height={48} /></Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LinkButton href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">Ingresar</LinkButton>
            <LinkButton href="/signup" size="sm">Probar 7 días gratis</LinkButton>
          </div>
        </div>
        <p className="border-t border-surface-border/60 px-5 py-2 text-center text-xs text-muted">
          Estás recorriendo una maqueta con datos de ejemplo. Nada se guarda, se envía ni se conecta.
        </p>
      </header>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[230px_minmax(0,1fr)]">
        <nav aria-label="Secciones de la maqueta" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {VIEWS.map((v) => (
              <li key={v.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => select(v.id)}
                  aria-current={v.id === view ? "page" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border px-4 py-2.5 text-left text-sm transition-all",
                    v.id === view ? "capsule-nav-active border-white" : "border-white/65 bg-white/20 text-muted hover:bg-white/50",
                  )}
                >
                  <v.icon className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                  <span><span className="block font-medium">{v.label}</span><span className="hidden text-[10px] opacity-70 lg:block">{v.caption}</span></span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <main id="contenido" className="min-w-0">{renderView(view, { onLocked })}</main>
      </div>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        <div className="glass-panel glass-panel-mixed flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
          <div>
            <p className="text-lg font-medium">¿Te gustó lo que viste?</p>
            <p className="mt-1 text-sm text-muted">Creá tu cuenta y usá Capsule con tus propios datos durante 7 días, sin costo.</p>
          </div>
          <LinkButton href="/signup" size="lg">Empezar mi prueba de 7 días</LinkButton>
        </div>
      </section>

      {locked && (
        <div role="status" className="glass-panel fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl items-center gap-3 rounded-2xl p-4 text-sm">
          <p className="min-w-0 flex-1 leading-relaxed">
            <span className="font-medium text-foreground">{locked}</span> se activa cuando creás tu cuenta. Tenés 7 días de prueba gratis.
          </p>
          <LinkButton href="/signup" size="sm">Empezar</LinkButton>
          <button type="button" onClick={() => setLocked(null)} aria-label="Cerrar aviso" className="text-muted hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}
