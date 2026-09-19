import { QUALIFICATION_LABELS, type Temperature } from "@/lib/qualification";

const ORDER: Temperature[] = ["hot", "warm", "cold"];

// Semáforo de solo lectura: los mismos tres puntos de vidrio de la app, con el estado en texto.
// Sin cualificar se muestra con los tres puntos apagados; nunca se presenta como Frío.
export function TemperatureBadge({ value, reason, updatedAt }: { value: Temperature | null; reason?: string | null; updatedAt?: string | null }) {
  const label = value ? QUALIFICATION_LABELS[value] : "Sin cualificar";
  return (
    <span className="inline-flex items-center gap-2 text-xs" title={[`Cualificación: ${label}`, reason, updatedAt ? new Date(updatedAt).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }) : null].filter(Boolean).join(" · ")}>
      <span className="flex items-center gap-1" aria-hidden="true">
        {ORDER.map((t) => (
          <span
            key={t}
            data-selected={value === t}
            className={"temperature-glass temperature-swatch temperature-" + t}
            style={{ opacity: value === t ? 1 : 0.25 }}
          />
        ))}
      </span>
      <span className={value ? "font-medium text-foreground" : "text-muted-2"}>{label}</span>
    </span>
  );
}
