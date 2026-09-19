export type StrategyValues = Record<string, Record<string, string>>;
export type StrategyOptions = Record<string, Record<string, string[]>>;
export type ResearchSource = { title: string; url: string };
export const WORKSPACE_KEY = "workspace:gtm";
export const RESEARCH_KEY = "workspace:research";
export const GOALS = ["Generar oportunidades", "Entrar en un segmento", "Lanzar un producto", "Mejorar la conversión"];
export const AREA_GUIDES: Record<string, { title: string; description: string; deliverable: string }> = {
 estrategia: { title: "Conocé la empresa", description: "Revisá qué vende y por qué la eligen. La IA prepara el contexto; vos validás.", deliverable: "Una base compartida para todas las acciones." },
 icp: { title: "Elegí a quién apuntar", description: "Seleccioná el segmento y los roles que vale la pena investigar.", deliverable: "Criterios que podés reutilizar en Prospección." },
 oferta: { title: "Elegí qué promocionar", description: "Partí de los productos y servicios que la empresa ya ofrece.", deliverable: "Una oferta concreta y su mensaje para la audiencia elegida." },
 precios: { title: "Precios de referencia", description: "Información comercial existente. Es opcional y no es el presupuesto de marketing.", deliverable: "Referencia para ventas, solo si está confirmada." },
 canales: { title: "Prepará las acciones", description: "Elegí cómo llegar a la audiencia y qué preparar primero.", deliverable: "El contexto para crear mensajes, contenido y buscar cuentas." },
};
