import { PublicNav } from "@/components/marketing/PublicNav";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { ContextWeb } from "@/components/marketing/ContextWeb";
import { Ticker } from "@/components/marketing/Ticker";
import { Container, Eyebrow } from "@/components/ui/Container";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import {
  Target,
  Database,
  Mail,
  MessageCircle,
  Palette,
  ArrowRight,
  CircleDot,
  Bot,
  KanbanSquare,
  BarChart3,
  Zap,
  Search,
  Check,
} from "lucide-react";

const problemas = [
  {
    title: "El ICP no está escrito en ningún lado",
    body: "Se sabe intuitivamente qué cliente conviene, pero nadie lo puso en un documento que el equipo pueda seguir.",
  },
  {
    title: "La prospección depende de una persona",
    body: "El primer contacto se arma a mano, sin plantilla ni criterio repetible. Si esa persona no está, el canal se corta.",
  },
  {
    title: "El CRM es una planilla que nadie actualiza",
    body: "Los contactos, el estado de cada cuenta y los próximos pasos viven en la memoria de alguien, no en un sistema.",
  },
  {
    title: "Precio y margen se deciden caso por caso",
    body: "Sin una estructura de precios y rentabilidad por canal, cada negociación empieza de cero.",
  },
  {
    title: "No hay un funnel definido",
    body: "No está claro qué pasa entre 'mandé un mensaje' y 'llegó el primer pedido', ni quién es responsable de cada paso.",
  },
];

const modulos = [
  {
    icon: Target,
    title: "Build",
    tagline: "Encontrá tu dirección.",
    body: "Definí a quién le vendés, qué ofrecés y a qué precio. La base común de la que parte todo lo demás.",
    tags: ["Estrategia", "ICP", "Oferta"],
    href: "/build/estrategia",
    highlight: true,
  },
  {
    icon: Search,
    title: "Discover",
    tagline: "Conectá con quien importa.",
    body: "Empresas, contactos y señales relevantes para construir relaciones con contexto, desde el inicio.",
    tags: ["Empresas", "Contactos", "Señales"],
    href: "/prospeccion",
    highlight: false,
  },
  {
    icon: Palette,
    title: "Studio & Social",
    tagline: "Hacé que tu voz llegue.",
    body: "Una misma estrategia para tus contenidos, piezas creativas y mensajes de prospección.",
    tags: ["Studio", "LinkedIn", "Calendario"],
    href: "/studio",
    highlight: false,
  },
  {
    icon: KanbanSquare,
    title: "Sell & Manage",
    tagline: "Dale continuidad a cada oportunidad.",
    body: "Campañas, tareas y pipeline conectados para que el siguiente paso tenga toda la información.",
    tags: ["Campañas", "Pipeline", "CRM"],
    href: "/crm/pipeline",
    highlight: false,
  },
];

const pasos = [
  {
    title: "Definí la base",
    body: "Tu negocio, tu cliente ideal y tu propuesta de valor se convierten en el contexto común de todo el sistema.",
  },
  {
    title: "Activá las conexiones",
    body: "Relacioná estrategia, contenido y campañas con los comercios a los que querés llegar.",
  },
  {
    title: "Aprendé y avanzá",
    body: "Conectá actividad y oportunidades para entender qué funciona y ordenar tu próximo paso.",
  },
];

const incluye = [
  "Definición de la estrategia B2B",
  "Target y segmentación de comercios",
  "Propuesta comercial para el punto de venta",
  "Estructura de precios, márgenes y rentabilidad",
  "Catálogo y presentación comercial",
  "Diseño del email de prospección",
  "Canal y estrategia de contacto por WhatsApp",
  "Definición del funnel comercial",
  "CRM y estructura de gestión",
  "Estrategia de captación",
  "Definición de los canales de venta",
];

const funnel = [
  { label: "Primer contacto", detail: "Email o WhatsApp con gancho específico" },
  { label: "Interés", detail: "Responde, pregunta, pide catálogo o precio" },
  { label: "Reunión", detail: "Demo o visita al punto de venta" },
  { label: "Primer pedido", detail: "Alta en CRM como cliente activo" },
];

const plataforma = [
  {
    icon: KanbanSquare,
    title: "CRM",
    body: "Empresas, contactos y pipeline separados en Outbound e Inbound, con actividad y próximos pasos por cuenta.",
    href: "/crm",
    status: "Activo" as const,
  },
  {
    icon: Palette,
    title: "Studio",
    body: "Las herramientas comerciales (emails, propuestas, posts, briefings) y el diseño de imágenes para publicaciones.",
    href: "/studio",
    status: "Activo" as const,
  },
  {
    icon: Bot,
    title: "Chat",
    body: "Un asistente conversacional con el contexto de tu estrategia, tu ICP y tu CRM para resolver dudas al vuelo.",
    href: "/chat",
    status: "Activo" as const,
  },
  {
    icon: BarChart3,
    title: "Integraciones",
    body: "Supabase, LinkedIn, proveedores de datos y MCPs propios. Cada una muestra su estado real de conexión.",
    href: "/configuracion/integraciones",
    status: "Configurar" as const,
  },
];

const planes = [
  {
    name: "Outbound",
    tag: "Prospección activa",
    body: "Para captar comercios nuevos con un proceso repetible.",
    features: [
      "Segmentación y prospección de cuentas nuevas",
      "Email de prospección + secuencias por WhatsApp",
      "Scoring de leads (fit, timing, accesibilidad)",
      "Pipeline Outbound en el CRM, de contacto a pedido",
    ],
    highlight: false,
  },
  {
    name: "Inbound",
    tag: "Contenido y demanda entrante",
    body: "Para generar interés propio y convertirlo en oportunidades.",
    features: [
      "Studio: las 12 herramientas comerciales con IA",
      "Diseño de imágenes con IA para publicaciones",
      "Calendario editorial compartido con Social",
      "Pipeline Inbound en el CRM, separado del Outbound",
    ],
    highlight: false,
  },
  {
    name: "Outbound + Inbound",
    tag: "Sistema completo",
    body: "Los dos motores conectados al mismo CRM y a la misma estrategia.",
    features: [
      "Todo lo de Outbound e Inbound",
      "Build: Estrategia, ICP, Oferta, Precios y Canales",
      "Chat asistente y panel de Configuración/Integraciones",
      "Prioridad para conectar Supabase, LinkedIn y proveedores de datos",
    ],
    highlight: true,
  },
];

const faqs = [
  {
    q: "¿Capsule GTM ejecuta la venta por nosotros?",
    a: "No. Capsule GTM diseña y estructura el sistema — estrategia, CRM, canales y materiales — para que el equipo comercial lo ejecute puertas adentro.",
  },
  {
    q: "¿Necesito tener todo definido para empezar a usarlo?",
    a: "No. La plataforma se construye por capas: primero la estructura completa (estrategia, CRM, canales), después se conectan los datos e integraciones reales.",
  },
  {
    q: "¿Qué pasa si todavía no conecté una integración (LinkedIn, WhatsApp, un proveedor de datos)?",
    a: "Cada módulo muestra honestamente si está conectado, pendiente de configuración o en modo demo. Nunca se simula un envío, una publicación o un dato que no ocurrió de verdad.",
  },
  {
    q: "¿Sirve solo para un tipo de negocio en particular?",
    a: "No. La estructura (estrategia, CRM, canales, contenido) aplica a cualquier operación comercial B2B que venda a comercios o puntos de venta.",
  },
];

export default function Home() {
  return (
    <>
      <PublicNav />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-grid bg-radial-fade">
          <Container className="relative grid gap-12 py-24 sm:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <Eyebrow>Un solo contexto. Todo tu GTM.</Eyebrow>
              <h1 className="text-balance mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl">
                Grandes ideas. Mejores conexiones.{" "}
                <span className="text-lime">Más pedidos.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
                Tu estrategia, tus datos y tus conversaciones, en una misma dirección.
                Una forma de conectar marketing y ventas B2B — pensada a partir de la
                venta a comercios y puntos de venta.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <LinkButton href="/signup" size="lg">
                  Creá tu Capsule
                  <ArrowRight className="h-4 w-4" />
                </LinkButton>
                <a
                  href="#sistema"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-lime"
                >
                  Así se conecta todo
                  <ArrowRight className="h-4 w-4 rotate-90" />
                </a>
              </div>
              <p className="mt-10 text-sm text-muted-2">
                Pensado para equipos B2B. Diseñado para trabajar juntos.
              </p>
            </div>
            <ContextWeb />
          </Container>
        </section>

        <Ticker />

        {/* PROBLEMA */}
        <section className="border-t border-surface-border/60 py-20">
          <Container>
            <Eyebrow>El problema</Eyebrow>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Lo que suele pasar antes de tener un sistema
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {problemas.map((p) => (
                <Card key={p.title}>
                  <CardTitle>{p.title}</CardTitle>
                  <CardDescription className="mt-2">{p.body}</CardDescription>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* EL SISTEMA */}
        <section id="sistema" className="border-t border-surface-border/60 py-20">
          <Container>
            <Eyebrow>Menos fragmentación. Más contexto.</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Todo parte de una idea. Todo vive en tu Capsule.
            </h2>
            <p className="mt-4 max-w-2xl text-muted">
              Del primer insight a la próxima conversación comercial. Cada módulo
              aporta contexto al siguiente.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {modulos.map(({ icon: Icon, ...m }) => (
                <Card
                  key={m.title}
                  className={
                    m.highlight
                      ? "flex flex-col gap-4 border-lime/40 bg-lime/45 backdrop-blur-xl shadow-[0_0_60px_-12px_rgba(212,255,92,0.8)]"
                      : "flex flex-col gap-4"
                  }
                >
                  <div
                    className={
                      m.highlight
                        ? "flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lime"
                        : "flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2 text-lime"
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime">{m.title}</p>
                  <h3 className="text-2xl font-semibold text-foreground">{m.tagline}</h3>
                  <p className={m.highlight ? "text-sm leading-relaxed text-foreground/80" : "text-sm leading-relaxed text-muted"}>
                    {m.body}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {m.tags.map((tag) => (
                      <span
                        key={tag}
                        className={
                          m.highlight
                            ? "rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-foreground/90"
                            : "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted"
                        }
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div
                    className={m.highlight ? "mt-2 border-t border-white/15 pt-4" : "mt-2 border-t border-white/10 pt-4"}
                  >
                    <LinkButton
                      href={m.href}
                      variant="ghost"
                      size="sm"
                      className="!px-0 text-foreground hover:text-lime"
                    >
                      Explorar {m.title.toLowerCase()}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </LinkButton>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* 3 PASOS */}
        <section className="border-t border-surface-border/60 py-20">
          <Container>
            <Eyebrow>Del contexto a la acción</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Crecer es conectar los siguientes pasos
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {pasos.map((paso, i) => (
                <div key={paso.title} className="border-t border-lime/30 pt-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-lime/30 font-mono text-xs text-lime">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">{paso.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{paso.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* QUE INCLUYE */}
        <section id="incluye" className="border-t border-surface-border/60 py-20">
          <Container>
            <Eyebrow>Qué incluye</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Todo lo que Varowa necesita para implementarlo puertas adentro
            </h2>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {incluye.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-surface-border bg-surface/60 p-4"
                >
                  <CircleDot className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                  <span className="text-sm text-foreground/90">{item}</span>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* PROCESO / FUNNEL */}
        <section id="proceso" className="border-t border-surface-border/60 py-20">
          <Container>
            <Eyebrow>Cómo funciona</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              De primer contacto a primer pedido
            </h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {funnel.map((f, i) => (
                <div key={f.label} className="relative">
                  <Card className="h-full">
                    <span className="font-mono text-xs text-muted-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <CardTitle className="mt-2">{f.label}</CardTitle>
                    <CardDescription className="mt-2">{f.detail}</CardDescription>
                  </Card>
                  {i < funnel.length - 1 && (
                    <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-lime sm:block" />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-2">
              Cada paso queda registrado en el CRM: quién lo mueve, cuándo, y con qué
              actividad asociada. Nada pasa de etapa solo por guardar una fecha.
            </p>
          </Container>
        </section>

        {/* PLATAFORMA */}
        <section id="plataforma" className="border-t border-surface-border/60 py-20">
          <Container>
            <Eyebrow>La plataforma</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              El sistema, convertido en herramienta de trabajo diario
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {plataforma.map(({ icon: Icon, ...m }) => (
                <Card key={m.title} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2 text-lime">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge tone={m.status === "Activo" ? "ok" : "warning"}>
                      {m.status}
                    </Badge>
                  </div>
                  <CardTitle>{m.title}</CardTitle>
                  <CardDescription>{m.body}</CardDescription>
                  <LinkButton href={m.href} variant="outline" size="sm" className="mt-auto w-fit">
                    Abrir {m.title}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </LinkButton>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* OUTBOUND / INBOUND */}
        <section className="border-t border-surface-border/60 py-20">
          <Container>
            <Eyebrow>Dos motores, un mismo CRM</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Outbound e Inbound, separados pero conectados
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Card className="border-lime/25">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-lime" />
                  <CardTitle>Outbound</CardTitle>
                </div>
                <CardDescription className="mt-3">
                  Prospección activa: segmentación de comercios nuevos, email
                  frío, secuencias por WhatsApp y seguimiento hasta agendar reunión.
                </CardDescription>
              </Card>
              <Card className="border-lime/25">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-lime" />
                  <CardTitle>Inbound</CardTitle>
                </div>
                <CardDescription className="mt-3">
                  Demanda entrante: contenido, catálogo y propuestas que generan
                  interés propio, con su propio pipeline dentro del mismo CRM.
                </CardDescription>
              </Card>
            </div>
          </Container>
        </section>

        {/* PRECIOS Y PLANES */}
        <section id="precios" className="border-t border-surface-border/60 py-20">
          <Container>
            <Eyebrow>Precios y planes</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Elegí el motor que necesitás activar primero
            </h2>
            <p className="mt-4 max-w-2xl text-muted">
              Los tres planes comparten el mismo CRM. Podés empezar por uno y sumar el
              otro cuando lo necesites, sin duplicar datos.
            </p>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {planes.map((plan) => (
                <Card
                  key={plan.name}
                  className={
                    plan.highlight
                      ? "flex flex-col gap-5 border-lime/40 bg-lime/45 backdrop-blur-xl shadow-[0_0_60px_-12px_rgba(212,255,92,0.8)]"
                      : "flex flex-col gap-5"
                  }
                >
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime">
                      {plan.tag}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-foreground">{plan.name}</h3>
                    <p className="mt-2 text-sm text-muted">{plan.body}</p>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <span className="text-3xl font-semibold text-foreground">A definir</span>
                    <p className="mt-1 text-xs text-muted-2">
                      Precio a coordinar según alcance. Todavía no hay tarifas publicadas.
                    </p>
                  </div>
                  <ul className="flex flex-1 flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/85">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <LinkButton
                    href="/signup"
                    variant={plan.highlight ? "primary" : "secondary"}
                    size="sm"
                    className="w-fit"
                  >
                    Hablemos
                    <ArrowRight className="h-3.5 w-3.5" />
                  </LinkButton>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-surface-border/60 py-20">
          <Container className="max-w-3xl">
            <Eyebrow>Preguntas frecuentes</Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Antes de que preguntes
            </h2>
            <div className="mt-10 divide-y divide-surface-border">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-foreground">
                    {f.q}
                    <span className="shrink-0 rounded-full border border-surface-border px-2 py-0.5 text-xs text-muted group-open:hidden">
                      +
                    </span>
                    <span className="hidden shrink-0 rounded-full border border-lime/40 px-2 py-0.5 text-xs text-lime group-open:block">
                      −
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA FINAL */}
        <section className="border-t border-surface-border/60 py-20">
          <Container>
            <div className="relative overflow-hidden rounded-3xl border border-lime/30 bg-lime/55 backdrop-blur-xl shadow-[0_0_90px_-15px_rgba(212,255,92,0.8)] p-10 sm:p-14">
              <Zap
                strokeWidth={1.25}
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="currentColor"
                fillOpacity={0.06}
                className="pointer-events-none absolute -right-6 -top-10 h-64 w-64 rotate-12 text-white/10 sm:h-80 sm:w-80"
              />
              <div className="relative flex flex-col items-start gap-6">
                <Eyebrow className="text-foreground/70">
                  El siguiente paso empieza con una visión
                </Eyebrow>
                <h2 className="max-w-lg text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
                  Todo tu GTM. En una <span className="italic text-lime">Capsule.</span>
                </h2>
                <div className="flex flex-wrap gap-3">
                  <LinkButton
                    href="/signup"
                    size="lg"
                    className="!bg-white !text-lime-foreground !border-transparent hover:!bg-white/90"
                  >
                    Explorá las posibilidades
                    <ArrowRight className="h-4 w-4" />
                  </LinkButton>
                  <LinkButton
                    href="/login"
                    variant="ghost"
                    size="lg"
                    className="!text-foreground hover:!bg-white/10"
                  >
                    Ya tengo cuenta
                  </LinkButton>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
