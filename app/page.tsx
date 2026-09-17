import { PublicNav } from "@/components/marketing/PublicNav";
import { PublicFooter } from "@/components/marketing/PublicFooter";
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
} from "lucide-react";

const problemas = [
  {
    title: "El ICP no está escrito en ningún lado",
    body: "Se sabe intuitivamente qué farmacia o comercio conviene, pero nadie lo puso en un documento que el equipo pueda seguir.",
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

const capas = [
  {
    icon: Target,
    step: "01",
    title: "Estrategia",
    tag: "OUTBOUND + INBOUND",
    body: "ICP de farmacias y comercios, propuesta de valor para el punto de venta, y estructura de precios, márgenes y rentabilidad por canal.",
  },
  {
    icon: Database,
    step: "02",
    title: "Datos y CRM",
    tag: "GESTIÓN",
    body: "Segmentación de cuentas, catálogo comercial y un CRM propio para llevar cada empresa desde el primer contacto hasta el pedido.",
  },
  {
    icon: Mail,
    step: "03",
    title: "Contacto multicanal",
    tag: "OUTBOUND",
    body: "Email de prospección y WhatsApp comercial con guiones, secuencias y criterio de cuándo pasar de uno a otro.",
  },
  {
    icon: Palette,
    step: "04",
    title: "Contenido y estudio",
    tag: "INBOUND",
    body: "Propuestas comerciales, piezas para el punto de venta y diseño de imágenes para publicaciones que generan interés entrante.",
  },
];

const incluye = [
  "Definición de la estrategia B2B",
  "Target y segmentación de farmacias y comercios",
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
    q: "¿Sirve solo para farmacias y comercios?",
    a: "El sistema se diseñó a partir de ese caso concreto de distribución B2B, pero la estructura (estrategia, CRM, canales, contenido) aplica a cualquier operación comercial B2B.",
  },
];

export default function Home() {
  return (
    <>
      <PublicNav />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-grid bg-radial-fade">
          <Container className="relative py-24 sm:py-32">
            <Eyebrow>Sistema de Go-to-Market B2B</Eyebrow>
            <h1 className="text-balance mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl">
              Convertimos tu estrategia comercial en{" "}
              <span className="text-lime">un sistema que se puede ejecutar.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Capsule GTM estructura la estrategia, los datos, el CRM y los canales de
              contacto de una operación B2B — pensado a partir de la venta a farmacias
              y comercios — para que tu propio equipo lo implemente de punta a punta.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <LinkButton href="/signup" size="lg">
                Crear cuenta gratis
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="#sistema" variant="secondary" size="lg">
                Ver el sistema
              </LinkButton>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-2">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-2">
                Diseñado para
              </span>
              <span>Distribución B2B</span>
              <span className="h-1 w-1 rounded-full bg-muted-2" />
              <span>Farmacias</span>
              <span className="h-1 w-1 rounded-full bg-muted-2" />
              <span>Comercios y puntos de venta</span>
            </div>
          </Container>
        </section>

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
            <Eyebrow>El sistema</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Cuatro capas, un mismo sistema comercial
            </h2>
            <p className="mt-4 max-w-2xl text-muted">
              Cada capa alimenta a la siguiente. La estrategia define el CRM, el CRM
              ordena el contacto, y el contenido sostiene tanto la salida (outbound)
              como la entrada (inbound) de oportunidades.
            </p>
            <div className="mt-10 grid gap-4 lg:grid-cols-4">
              {capas.map(({ icon: Icon, ...capa }) => (
                <Card key={capa.title} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-2">{capa.step}</span>
                    <Badge tone="lime">{capa.tag}</Badge>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2 text-lime">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{capa.title}</CardTitle>
                  <CardDescription>{capa.body}</CardDescription>
                </Card>
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
                  Prospección activa: segmentación de farmacias y comercios, email
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
            <Card className="flex flex-col items-start gap-6 bg-surface-2 p-10 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Entrá y probá la plataforma
                </h2>
                <p className="mt-2 max-w-md text-muted">
                  Creá una cuenta para ver el CRM, el Studio y el chat en funcionamiento.
                </p>
              </div>
              <div className="flex gap-3">
                <LinkButton href="/signup" size="lg">
                  Crear cuenta
                  <ArrowRight className="h-4 w-4" />
                </LinkButton>
                <LinkButton href="/login" variant="secondary" size="lg">
                  Ya tengo cuenta
                </LinkButton>
              </div>
            </Card>
          </Container>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
