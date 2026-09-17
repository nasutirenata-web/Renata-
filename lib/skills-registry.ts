export type SkillField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "email" | "contact-name";
  placeholder?: string;
  required?: boolean;
};

export type SkillTool = {
  slug: string;
  file: string;
  title: string;
  description: string;
  module: string;
  funnel: "outbound" | "inbound" | "ambos";
  fields: SkillField[];
};

export const skillTools: SkillTool[] = [
  {
    slug: "cold-email",
    file: "cold_email_skill.md",
    title: "Email de prospección en frío",
    description:
      "Un cold email de máximo 5 frases, con trigger específico y una sola pregunta final.",
    module: "Outbound · Email",
    funnel: "outbound",
    fields: [
      { name: "nombre", label: "Nombre del prospecto", type: "contact-name", required: true },
      {
        name: "cargo",
        label: "Cargo (se completa solo al elegir un contacto guardado)",
        type: "text",
      },
      { name: "email", label: "Email del prospecto", type: "email" },
      { name: "empresa", label: "Empresa y qué hace", type: "text", required: true },
      { name: "trigger", label: "Trigger (por qué contactar ahora)", type: "textarea", required: true },
      { name: "angulo", label: "Ángulo / problema que resolvés", type: "textarea", required: true },
    ],
  },
  {
    slug: "scoring-leads",
    file: "cualificacion-scoring-leads.md",
    title: "Cualificación y scoring de leads",
    description: "Puntúa una lista de leads por fit de empresa, fit de contacto, timing y accesibilidad.",
    module: "Outbound · Discover",
    funnel: "outbound",
    fields: [
      { name: "icp", label: "ICP de referencia (opcional)", type: "textarea" },
      { name: "leads", label: "Lista de leads (nombre, empresa, cargo — uno por línea)", type: "textarea", required: true },
    ],
  },
  {
    slug: "propuesta-comercial",
    file: "generador-propuesta-comercial.md",
    title: "Propuesta comercial",
    description: "Una propuesta de venta de hasta 5 páginas con el cliente como protagonista.",
    module: "CRM · Deal",
    funnel: "ambos",
    fields: [
      { name: "cliente", label: "Cliente, cargo y empresa", type: "text", required: true },
      { name: "problemas", label: "Problemas mencionados por el cliente", type: "textarea", required: true },
      { name: "caso", label: "Caso de éxito relevante", type: "textarea" },
      { name: "precios", label: "Precios / opciones de servicio", type: "textarea", required: true },
    ],
  },
  {
    slug: "objeciones",
    file: "argumentario-objeciones.md",
    title: "Argumentario de objeciones",
    description: "Clasifica una objeción y prepara la respuesta directa y la pregunta de rebote.",
    module: "CRM · Deal",
    funnel: "ambos",
    fields: [
      { name: "objecion", label: "Objeción concreta (dejar vacío para las 10 más comunes)", type: "textarea" },
      { name: "contexto", label: "Contexto del prospecto", type: "textarea" },
    ],
  },
  {
    slug: "auditor-landing",
    file: "auditor-landing-pages.md",
    title: "Auditor de landing pages",
    description: "Audita una página desde la perspectiva del comprador e identifica fugas de conversión.",
    module: "Intelligence · Conversion",
    funnel: "inbound",
    fields: [
      { name: "audiencia", label: "Audiencia (cargo, sector, nivel de consciencia)", type: "textarea", required: true },
      { name: "contenido", label: "URL o texto completo de la landing", type: "textarea", required: true },
    ],
  },
  {
    slug: "battlecard",
    file: "battlecard-competitiva.md",
    title: "Battlecard competitiva",
    description: "Ficha de una página para competir contra un competidor puntual.",
    module: "Intelligence · Competitors",
    funnel: "ambos",
    fields: [
      { name: "competidor", label: "Nombre del competidor", type: "text", required: true },
      { name: "notas", label: "Lo que sabés de ellos (precio, producto, clientes)", type: "textarea" },
    ],
  },
  {
    slug: "briefing-diseno",
    file: "briefing-diseñadores-creativos.md",
    title: "Briefing para diseñadores",
    description: "Briefing completo para pedir una pieza gráfica sin ida y vuelta.",
    module: "Studio · Create",
    funnel: "inbound",
    fields: [
      { name: "pieza", label: "Pieza y canal (ej: banner para LinkedIn)", type: "text", required: true },
      { name: "objetivo", label: "Objetivo de la pieza", type: "text", required: true },
      { name: "contenido", label: "Textos, CTA y datos que debe incluir", type: "textarea", required: true },
      { name: "referencias", label: "Referencias visuales (links o descripciones)", type: "textarea" },
    ],
  },
  {
    slug: "briefing-reunion",
    file: "briefing-pre-reunion.md",
    title: "Briefing pre-reunión",
    description: "Una página para leer 3 minutos antes de entrar a una reunión comercial.",
    module: "CRM · Meeting",
    funnel: "ambos",
    fields: [
      { name: "contacto", label: "Contacto y cargo", type: "text", required: true },
      { name: "empresa", label: "Empresa", type: "text", required: true },
      { name: "tipo", label: "Tipo de reunión (primer contacto, demo, cierre...)", type: "text", required: true },
      { name: "notas", label: "Notas o emails previos disponibles", type: "textarea" },
    ],
  },
  {
    slug: "post-linkedin",
    file: "generador-posts-linkedin.md",
    title: "Post de LinkedIn",
    description: "Un post que genera conversación real, no solo impresiones.",
    module: "Social · LinkedIn",
    funnel: "inbound",
    fields: [
      { name: "tema", label: "Tema, dato o historia de base", type: "textarea", required: true },
      { name: "audiencia", label: "Para quién es (cargo / sector)", type: "text" },
    ],
  },
  {
    slug: "newsletter",
    file: "newsletter-secuencia-bienvenida.md",
    title: "Newsletter y secuencia de bienvenida",
    description: "Newsletter regular de 600–1000 palabras, o los 5 emails de bienvenida.",
    module: "Studio · Content",
    funnel: "inbound",
    fields: [
      { name: "modo", label: "Modo (newsletter regular o secuencia de bienvenida)", type: "text", required: true },
      { name: "tema", label: "Tema o material de base", type: "textarea", required: true },
    ],
  },
  {
    slug: "calendario-editorial",
    file: "planificador-calendario-editorial.md",
    title: "Calendario editorial",
    description: "Un mes completo de publicaciones, con pilares y reciclaje de contenido.",
    module: "Studio · Calendar",
    funnel: "inbound",
    fields: [
      { name: "plataformas", label: "Plataformas y frecuencia", type: "text", required: true },
      { name: "pilares", label: "Pilares de contenido (3–5)", type: "textarea", required: true },
      { name: "objetivo", label: "Objetivo del mes", type: "text", required: true },
    ],
  },
  {
    slug: "resumen-llamada",
    file: "resumen-llamada-comercial.md",
    title: "Resumen de llamada comercial",
    description: "Convierte una transcripción en BANT+, CDW, señales y email de seguimiento.",
    module: "CRM · Calls",
    funnel: "ambos",
    fields: [
      { name: "transcripcion", label: "Transcripción o notas de la llamada", type: "textarea", required: true },
    ],
  },
];

export function getSkillTool(slug: string) {
  return skillTools.find((tool) => tool.slug === slug);
}
