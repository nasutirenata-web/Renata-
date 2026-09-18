"use client";

import { Mail, Megaphone, Check } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type Props = {
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  disabled?: boolean;
};

const fieldClass =
  "rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand disabled:opacity-50";

function ChannelCard({
  icon: Icon,
  title,
  subtitle,
  flow,
  active,
  onToggle,
  disabled,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  flow: string;
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card className={cn("flex flex-col gap-4 transition-colors", active && "border-brand/50")}>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="flex items-start justify-between gap-3 text-left"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface-2 text-brand">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="mt-1">{subtitle}</CardDescription>
            <p className="mt-2 text-xs text-muted-2">{flow}</p>
          </div>
        </div>
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
            active ? "border-brand bg-brand text-brand-foreground" : "border-surface-border bg-surface-2",
          )}
        >
          {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        </span>
      </button>
      {active && <div className="grid gap-3 sm:grid-cols-2">{children}</div>}
    </Card>
  );
}

export function EmailChannelSection({ values, onChange, disabled }: Props) {
  const outboundActive = values.outbound_activo === "Sí";
  const newsletterActive = values.newsletter_activo === "Sí";

  function field(name: string, label: string, placeholder?: string) {
    return (
      <label className="flex flex-col gap-1.5 text-sm">
        {label}
        <input
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          value={values[name] ?? ""}
          onChange={(e) => onChange(name, e.target.value)}
          className={fieldClass}
        />
      </label>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ChannelCard
        icon={Mail}
        title="Outbound / Leads"
        subtitle="Prospectá y contactá leads desde Capsule."
        flow="Lead encontrado → scoring → secuencia → email personalizado → respuesta → CRM"
        active={outboundActive}
        disabled={disabled}
        onToggle={() => onChange("outbound_activo", outboundActive ? "No" : "Sí")}
      >
        {field("outbound_remitente", "Remitente", "core@capsule-gtm.com.ar o tu cuenta conectada")}
        {field("outbound_frecuencia", "Frecuencia de la secuencia", "ej: 3 emails en 10 días")}
        {field("outbound_tipo", "Tipo de mensajes", "cold email, follow-up, breakup...")}
        {field("outbound_objetivo", "Objetivo", "ej: agendar una llamada")}
      </ChannelCard>

      <ChannelCard
        icon={Megaphone}
        title="Newsletter / Suscriptores"
        subtitle="Comunicá novedades y contenido a tu audiencia."
        flow="Suscriptor → lista → segmento → newsletter → métricas"
        active={newsletterActive}
        disabled={disabled}
        onToggle={() => onChange("newsletter_activo", newsletterActive ? "No" : "Sí")}
      >
        {field("newsletter_remitente", "Remitente", "novedades@capsule-gtm.com.ar")}
        {field("newsletter_frecuencia", "Frecuencia de envío", "ej: quincenal")}
        {field("newsletter_tipo", "Tipo de contenido", "novedades, producto, educativo...")}
        {field("newsletter_objetivo", "Objetivo", "ej: retención y engagement")}
      </ChannelCard>

      <p className="text-xs text-muted-2">
        Acá definís la estrategia del canal. Crear, programar y enviar campañas se hace después,
        desde Campañas → Email, con estas bases listas.
      </p>
    </div>
  );
}
