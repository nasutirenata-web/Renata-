// Traduce los errores de Gemini a algo que se pueda entender y resolver, en vez de mostrar el texto crudo del proveedor.
export function geminiErrorMessage(error: unknown, feature: "texto" | "imágenes" = "texto"): string {
  const description = error instanceof Error ? error.message : "Error desconocido.";

  if (/429|rate limit|quota|RESOURCE_EXHAUSTED/i.test(description)) {
    if (feature === "imágenes" && /free tier|limit: ?0/i.test(description)) {
      return "La cuenta de Gemini que usa Capsule está en el plan gratuito, que no incluye la generación de imágenes. Para usarla, activá la facturación de esa clave en Google AI Studio. Las demás funciones de IA siguen andando.";
    }
    return "Se alcanzó el límite de uso de Gemini por ahora. Esperá unos minutos y volvé a intentar. Si se repite, revisá el plan y la facturación de tu cuenta en Google AI Studio.";
  }
  if (/503|overloaded|unavailable/i.test(description)) {
    return "Gemini tiene mucha demanda en este momento. Volvé a intentar en unos minutos.";
  }
  if (/401|403|API key|permission/i.test(description)) {
    return "Gemini rechazó la clave configurada en el servidor. Revisá que GEMINI_API_KEY sea válida y tenga permiso para este modelo.";
  }
  return `Gemini devolvió un error: ${description}`;
}
