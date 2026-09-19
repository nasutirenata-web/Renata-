export type StrategyField = { name: string; label: string; placeholder?: string; rows?: number };
export type StrategySectionDef = { title: string; description: string; fields: StrategyField[] };
export type StrategyArea = {
  id: string;
  pathname: string;
  label: string;
  description: string;
  sections: StrategySectionDef[];
};

export const strategyAreas: StrategyArea[] = [
  {
    id: "estrategia",
    pathname: "/build/estrategia",
    label: "Estrategia B2B",
    description: "La base común: por qué existe el negocio, para quién, y qué lo hace ganar.",
    sections: [
      {
        title: "Business Profile",
        description: "Qué hace la empresa, en qué mercado compite y con qué diferenciales.",
        fields: [
          { name: "que_hace", label: "Qué hace la empresa (en una frase)" },
          { name: "mercado", label: "Mercado y geografía" },
          { name: "diferenciales", label: "Diferenciales frente a la competencia" },
        ],
      },
      {
        title: "Propuesta de valor",
        description: "Por qué una empresa debería elegir tu solución frente a otras alternativas.",
        fields: [
          { name: "problema", label: "Problema que resolvés para la empresa cliente" },
          { name: "valor", label: "Propuesta de valor concreta" },
          { name: "prueba", label: "Evidencia o casos que la respaldan" },
        ],
      },
      {
        title: "Objetivo comercial",
        description: "A dónde tiene que llegar el sistema comercial este semestre.",
        fields: [{ name: "objetivo", label: "Objetivo principal y métrica de éxito" }],
      },
    ],
  },
  {
    id: "icp",
    pathname: "/build/icp",
    label: "Cliente ideal · ICP",
    description: "A quién le vendés y cómo se segmentan tus empresas objetivo.",
    sections: [
      {
        title: "Segmentación",
        description: "Los criterios que definen una cuenta objetivo.",
        fields: [
          { name: "segmento", label: "Segmentos (ej: software B2B, servicios de tecnología, agencias)" },
          { name: "geografia", label: "Geografía / zona de cobertura" },
          { name: "tamano", label: "Tamaño o volumen estimado de compra" },
        ],
      },
      {
        title: "Perfil del decisor",
        description: "Quién decide la compra dentro del cliente B2B.",
        fields: [
          { name: "decisor", label: "Cargo / rol del decisor" },
          { name: "criterios", label: "Qué mira al evaluar un nuevo proveedor" },
        ],
      },
      {
        title: "Señales de fit",
        description: "Qué hace que una cuenta sea prioritaria para prospectar ahora.",
        fields: [{ name: "senales", label: "Señales de buen fit / buen timing" }],
      },
    ],
  },
  {
    id: "oferta",
    pathname: "/build/oferta",
    label: "Oferta y catálogo",
    description: "La propuesta comercial para el cliente B2B y su presentación.",
    sections: [
      {
        title: "Propuesta comercial",
        description: "Qué se ofrece concretamente a una empresa cliente.",
        fields: [
          { name: "oferta", label: "Descripción de la oferta" },
          { name: "condiciones", label: "Condiciones comerciales existentes (alcance, plazos, contratación)" },
        ],
      },
      {
        title: "Catálogo / presentación comercial",
        description: "Los productos o líneas que se muestran en el primer contacto.",
        fields: [
          {
            name: "catalogo",
            label: "Listado de productos / líneas, con lo más relevante de cada una",
            rows: 5,
          },
        ],
      },
    ],
  },
  {
    id: "precios",
    pathname: "/build/precios",
    label: "Precios y rentabilidad",
    description: "Estructura de precios, márgenes y rentabilidad por canal.",
    sections: [
      {
        title: "Estructura de precios",
        description: "Precios de venta existentes de la empresa; completalos solo si los conocés.",
        fields: [
          { name: "lista", label: "Precios / rangos por servicio, solución o suscripción", rows: 4 },
          { name: "descuentos", label: "Descuentos por volumen o condición" },
        ],
      },
      {
        title: "Márgenes y rentabilidad",
        description: "Qué margen deja cada canal y dónde está el piso aceptable.",
        fields: [
          { name: "margen", label: "Margen objetivo por canal" },
          { name: "piso", label: "Piso de precio / margen mínimo aceptable" },
        ],
      },
    ],
  },
  {
    id: "canales",
    pathname: "/build/canales",
    label: "Canales",
    description: "Estrategia de contacto por email y WhatsApp, y canales de venta.",
    sections: [
      {
        title: "Canal de email",
        description:
          "Configurá la estrategia del canal: para qué lo usás y cómo. Preparar mensajes no los envía. El envío requiere un canal conectado.",
        fields: [
          { name: "outbound_activo", label: "¿Usás email para Outbound / Leads? (sí / no)" },
          { name: "outbound_remitente", label: "Remitente para Outbound (ej: core@tudominio.com)" },
          { name: "outbound_frecuencia", label: "Frecuencia de envío en la secuencia" },
          { name: "outbound_tipo", label: "Tipo de mensajes (ej: cold email, follow-up, breakup)" },
          { name: "outbound_objetivo", label: "Objetivo de la campaña de Outbound" },
          { name: "newsletter_activo", label: "¿Usás email para Newsletter / Suscriptores? (sí / no)" },
          { name: "newsletter_remitente", label: "Remitente para Newsletter" },
          { name: "newsletter_frecuencia", label: "Frecuencia de envío del newsletter" },
          { name: "newsletter_tipo", label: "Tipo de contenido (novedades, producto, educativo...)" },
          { name: "newsletter_objetivo", label: "Objetivo del newsletter" },
        ],
      },
      {
        title: "Canal de WhatsApp",
        description: "Cuándo pasar de email a WhatsApp, y qué tono usar ahí.",
        fields: [
          { name: "whatsapp_uso", label: "Cuándo se usa WhatsApp (momento del funnel)" },
          { name: "whatsapp_tono", label: "Tono y formato de los mensajes por WhatsApp" },
        ],
      },
      {
        title: "Canales de venta",
        description: "Los canales por los que efectivamente se concreta una venta.",
        fields: [{ name: "canales_venta", label: "Canales de venta (venta consultiva, autoservicio, partners, etc.)" }],
      },
    ],
  },
];

export function sectionKey(pathname: string, title: string) {
  return pathname + ":" + title;
}

export const allSteps = strategyAreas.flatMap((area) =>
  area.sections.map((section) => ({ area, section, key: sectionKey(area.pathname, section.title) })),
);
