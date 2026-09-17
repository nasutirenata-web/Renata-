"use client";

import { Check } from "lucide-react";

export type Temperature = "hot" | "warm" | "cold";
export const temperatureOptions = [
  { value: "hot", label: "Caliente" },
  { value: "warm", label: "Medio" },
  { value: "cold", label: "Frío" },
] as const;

export function TemperatureControl({ value, onChange, disabled = false, label = "Cualificación del lead" }: {
  value: Temperature;
  onChange: (value: Temperature) => void;
  disabled?: boolean;
  label?: string;
}) {
  return <div role="group" aria-label={label} className="flex gap-1">
    {temperatureOptions.map(option => <button
      key={option.value} type="button" disabled={disabled}
      aria-label={option.label} aria-pressed={value === option.value}
      title={option.label} onClick={() => onChange(option.value)}
      className="temperature-choice flex h-11 w-11 items-center justify-center rounded-xl disabled:cursor-wait disabled:opacity-60"
    ><span className={"temperature-glass temperature-" + option.value} data-selected={value === option.value}>
      {value === option.value && <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true"/>}
    </span></button>)}
  </div>;
}

export function TemperatureLegend() {
  return <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted" aria-label="Colores de cualificación">
    {temperatureOptions.map(option => <span key={option.value} className="flex items-center gap-2"><span className={"temperature-glass temperature-swatch temperature-" + option.value} aria-hidden="true"/>{option.label}</span>)}
  </div>;
}
