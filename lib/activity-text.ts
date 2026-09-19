// Textos legibles para el historial. En la base cada evento guarda un código interno (kind) y un texto;
// acá se traducen a lenguaje de trabajo para que nunca se vean códigos ni rutas técnicas.

const LABELS: Record<string, string> = {
  respuesta_interes: "Respuesta con interés",
  reunion_confirmada: "Reunión confirmada",
  propuesta_solicitada: "Propuesta solicitada",
  sin_interes: "Sin interés por ahora",
  fuera_icp: "Fuera del cliente ideal",
  baja_solicitada: "Baja solicitada",
  contacto_creado: "Contacto agregado",
  empresa_creada: "Empresa agregada",
  oportunidad_creada: "Oportunidad creada",
  cualificacion_lead: "Cualificación de lead",
  estrategia_guardada: "Estrategia guardada",
  ia_generacion: "Contenido generado con IA",
  busqueda_ia: "Búsqueda con IA",
  hunter_email: "Email agregado desde Hunter",
  nota: "Nota",
  email: "Email",
  whatsapp: "WhatsApp",
  llamada: "Llamada",
  cambio_etapa: "Cambio de etapa",
};

export function activityLabel(kind: string): string {
  return LABELS[kind] ?? kind.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

// También limpia registros viejos, que guardaron claves técnicas como «/build/oferta:Propuesta comercial».
export function activityDetail(body: string | null): string {
  if (!body) return "";
  return body
    .replace(/«\/[^:»]+:([^»]+)»/g, "«$1»")
    .replace(/Búsqueda de prospectos \((.*)\) → (\d+) hipótesis generadas por IA\./, "Sugerencias de IA sin verificar: $2 empresas para «$1».");
}
