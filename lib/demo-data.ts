import type { Temperature } from "@/components/crm/TemperatureControl";
import type { KpiData } from "@/components/kpi/KpiMeterView";

// Datos de ejemplo para la maqueta pública (/demo). Son ficticios y se rotulan como
// ejemplo en pantalla: nada de esto se guarda, se envía ni proviene de una cuenta real.

// La estrategia es de la empresa donde trabaja quien usa Capsule. El caso es ficticio: una empresa
// que vende automatización con IA a otras empresas. 'input' es lo que completa la persona;
// 'suggestion' es un ejemplo de cómo la IA ayuda a ordenarlo (en la maqueta no se genera nada).
export const DEMO_STEPS = [
  { id: "empresa", title: "Tu empresa", question: "¿Qué hace la empresa donde trabajás y en qué mercado compite?",
    input: "Vende software de automatización con IA para que las áreas de operaciones de otras empresas dejen de cargar datos a mano. Compite en Latinoamérica.",
    suggestion: "Borrador de perfil: empresa de automatización con IA para operaciones B2B, con foco en Latinoamérica. Te falta definir dos diferenciales frente a otras alternativas." },
  { id: "icp", title: "Para quién es", question: "¿A qué empresas y a qué personas les habla esta estrategia?",
    input: "Empresas de servicios y tecnología de 50 a 500 personas. Decide la Directora de Operaciones; influye el área de sistemas.",
    suggestion: "Cliente ideal sugerido: empresas medianas con procesos manuales repetitivos. Decisora: operaciones. Influyente: sistemas. Falta indicar qué empresas quedan afuera." },
  { id: "valor", title: "Propuesta de valor", question: "¿Qué problema resuelve y por qué elegirlos?",
    input: "Reduce el tiempo que el equipo dedica a tareas manuales y baja los errores de carga. Tiene un caso de una empresa que redujo su tiempo de cierre mensual.",
    suggestion: "Mensaje sugerido: menos trabajo manual y menos errores, con un caso que lo respalde. Recordá usar solo evidencia real y verificada." },
  { id: "canales", title: "Canales", question: "¿Por dónde llegan a esas empresas?",
    input: "Contacto directo por email y LinkedIn con las cuentas prioritarias, y contenido en LinkedIn para generar interés.",
    suggestion: "Plan sugerido: outbound para cuentas prioritarias e inbound con contenido. Definí quién responde y cómo vas a identificar de dónde llega cada contacto." },
  { id: "objetivo", title: "Objetivo y medición", question: "¿A dónde tiene que llegar y cómo lo van a medir?",
    input: "Conseguir reuniones con empresas del perfil ideal durante el próximo trimestre y revisar el avance cada semana.",
    suggestion: "Métricas sugeridas: contactos nuevos, reuniones logradas y oportunidades abiertas, con revisión semanal, mensual y trimestral." },
] as const;

export const DEMO_INDUSTRIES = ["Marketing", "IA", "Tecnología"] as const;
export const DEMO_LEVELS = ["Dirección", "Growth", "Ventas"] as const;

export const DEMO_PROSPECTS: { id: string; company: string; industry: string; level: string; role: string; size: string; country: string }[] = [
  { id: "p1", company: "Empresa de ejemplo 1", industry: "Marketing", level: "Dirección", role: "Directora de Marketing", size: "20–50", country: "Argentina" },
  { id: "p2", company: "Empresa de ejemplo 2", industry: "IA", level: "Growth", role: "Head of Growth", size: "50–200", country: "México" },
  { id: "p3", company: "Empresa de ejemplo 3", industry: "Tecnología", level: "Ventas", role: "Gerente de Ventas", size: "10–20", country: "Chile" },
  { id: "p4", company: "Empresa de ejemplo 4", industry: "Marketing", level: "Dirección", role: "CMO", size: "50–200", country: "Colombia" },
  { id: "p5", company: "Empresa de ejemplo 5", industry: "IA", level: "Growth", role: "Growth Manager", size: "20–50", country: "España" },
  { id: "p6", company: "Empresa de ejemplo 6", industry: "Tecnología", level: "Ventas", role: "Director Comercial", size: "200+", country: "Argentina" },
  { id: "p7", company: "Empresa de ejemplo 7", industry: "IA", level: "Dirección", role: "CEO", size: "10–20", country: "Uruguay" },
  { id: "p8", company: "Empresa de ejemplo 8", industry: "Marketing", level: "Ventas", role: "Responsable de Ventas", size: "20–50", country: "México" },
];

export const DEMO_LEADS: { id: string; name: string; role: string; company: string; temperature: Temperature }[] = [
  { id: "l1", name: "Contacto de ejemplo 1", role: "Directora de Marketing", company: "Empresa de ejemplo A", temperature: "hot" },
  { id: "l2", name: "Contacto de ejemplo 2", role: "Head of Growth", company: "Empresa de ejemplo B", temperature: "hot" },
  { id: "l3", name: "Contacto de ejemplo 3", role: "Gerente Comercial", company: "Empresa de ejemplo C", temperature: "warm" },
  { id: "l4", name: "Contacto de ejemplo 4", role: "CTO", company: "Empresa de ejemplo D", temperature: "warm" },
  { id: "l5", name: "Contacto de ejemplo 5", role: "Fundador", company: "Empresa de ejemplo E", temperature: "warm" },
  { id: "l6", name: "Contacto de ejemplo 6", role: "Responsable de Alianzas", company: "Empresa de ejemplo F", temperature: "cold" },
];

// Mismas etapas que el pipeline real de la app.
export const DEMO_STAGES: { id: string; label: string; deals: { title: string; company: string; value: number }[] }[] = [
  { id: "contacto", label: "Primer contacto", deals: [
    { title: "Oportunidad de ejemplo 1", company: "Empresa de ejemplo A", value: 4800 },
    { title: "Oportunidad de ejemplo 2", company: "Empresa de ejemplo B", value: 3200 },
  ] },
  { id: "interes", label: "Interés", deals: [
    { title: "Oportunidad de ejemplo 3", company: "Empresa de ejemplo C", value: 7500 },
  ] },
  { id: "reunion", label: "Reunión", deals: [
    { title: "Oportunidad de ejemplo 4", company: "Empresa de ejemplo D", value: 12000 },
    { title: "Oportunidad de ejemplo 5", company: "Empresa de ejemplo E", value: 6400 },
  ] },
  { id: "pedido", label: "Primer pedido", deals: [
    { title: "Oportunidad de ejemplo 6", company: "Empresa de ejemplo F", value: 9800 },
  ] },
  { id: "cliente", label: "Cliente activo", deals: [
    { title: "Oportunidad de ejemplo 7", company: "Empresa de ejemplo G", value: 5600 },
  ] },
];

const openDeals = DEMO_STAGES.filter((s) => s.id !== "cliente").flatMap((s) => s.deals);

// Medidor de KPIs de ejemplo: totales calculados con los mismos leads y oportunidades de arriba;
// los períodos son cifras inventadas, rotuladas como ejemplo en pantalla.
export const DEMO_KPIS: KpiData = {
  leads: {
    hot: DEMO_LEADS.filter((l) => l.temperature === "hot").length,
    warm: DEMO_LEADS.filter((l) => l.temperature === "warm").length,
    cold: DEMO_LEADS.filter((l) => l.temperature === "cold").length,
  },
  companies: 7,
  stages: DEMO_STAGES.map((s) => ({ key: s.id, label: s.label, count: s.deals.length })),
  openDeals: openDeals.length,
  clients: DEMO_STAGES.find((s) => s.id === "cliente")?.deals.length ?? 0,
  pipelineValue: [{ currency: "USD", total: openDeals.reduce((sum, d) => sum + d.value, 0) }],
  periods: [
    { key: "week", title: "Semanal", range: "Semana de ejemplo", previousLabel: "semana anterior", metrics: [
      { label: "Leads nuevos", current: 3, previous: 5 },
      { label: "Empresas nuevas", current: 2, previous: 1 },
      { label: "Oportunidades nuevas", current: 1, previous: 2 },
      { label: "Actividades registradas", current: 6, previous: 4 },
    ] },
    { key: "month", title: "Mensual", range: "Mes de ejemplo", previousLabel: "mes anterior", metrics: [
      { label: "Leads nuevos", current: 12, previous: 9 },
      { label: "Empresas nuevas", current: 5, previous: 4 },
      { label: "Oportunidades nuevas", current: 4, previous: 3 },
      { label: "Actividades registradas", current: 21, previous: 18 },
    ] },
    { key: "quarter", title: "Trimestral", range: "Trimestre de ejemplo", previousLabel: "trimestre anterior", metrics: [
      { label: "Leads nuevos", current: 31, previous: 26 },
      { label: "Empresas nuevas", current: 12, previous: 10 },
      { label: "Oportunidades nuevas", current: 9, previous: 8 },
      { label: "Actividades registradas", current: 64, previous: 55 },
    ] },
  ],
};

export const DEMO_POST =
  "Muchos equipos de marketing B2B pierden oportunidades por algo simple: el seguimiento vive en cinco lugares distintos.\n\nEste mes ordenamos el proceso en una sola vista y el equipo dejó de preguntarse quién tenía la última conversación.\n\n¿Cómo organizan hoy el seguimiento de sus leads?";

export const DEMO_WEEK = [
  { day: "Lun", item: "Post: seguimiento de leads" },
  { day: "Mar", item: "" },
  { day: "Mié", item: "Diseño: carrusel de ICP" },
  { day: "Jue", item: "" },
  { day: "Vie", item: "Post: caso de un cliente" },
];

export const DEMO_MESSAGES = [
  { id: "m1", author: "Integrante 1", mine: false, body: "¿Quién sigue a los leads calientes de esta semana?" },
  { id: "m2", author: "Vos", mine: true, body: "Yo tomo los dos primeros y te paso el resto." },
  { id: "m3", author: "Integrante 2", mine: false, body: "Perfecto. Subí el borrador del post al calendario." },
];
