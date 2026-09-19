export type Temperature = "hot" | "warm" | "cold";
export const SIGNALS = {
  respuesta_interes: { label: "Respondió con interés", temperature: "warm", reason: "El contacto respondió con interés." },
  reunion_confirmada: { label: "Confirmó una reunión", temperature: "hot", reason: "El contacto confirmó una reunión." },
  propuesta_solicitada: { label: "Pidió una propuesta", temperature: "hot", reason: "El contacto pidió una propuesta comercial." },
  sin_interes: { label: "Indicó que no tiene interés", temperature: "cold", reason: "El contacto indicó que no tiene interés." },
  fuera_icp: { label: "Se confirmó que no encaja", temperature: "cold", reason: "Se confirmó que el contacto no encaja con el cliente ideal." },
  baja_solicitada: { label: "Pidió no recibir más mensajes", temperature: "cold", reason: "Pidió no recibir más mensajes. No continuar el contacto." },
} as const;
export type SignalKind = keyof typeof SIGNALS;
export function isSignalKind(value: string): value is SignalKind { return Object.hasOwn(SIGNALS, value); }
