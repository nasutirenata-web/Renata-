"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { temperatureOptions, type Temperature } from "@/components/crm/TemperatureControl";

export type TemperatureCounts = Record<Temperature, number>;

export function LeadTrafficLight({
  counts,
  total,
  value,
  onChange,
  className,
}: {
  counts: TemperatureCounts;
  total: number;
  value: "" | Temperature;
  onChange: (value: "" | Temperature) => void;
  className?: string;
}) {
  return (
    <aside
      aria-label="Semáforo de leads"
      className={cn("glass-panel flex flex-col gap-4 rounded-3xl p-5", className)}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-foreground">Semáforo</p>
          <p className="mt-0.5 text-xs text-muted-2">
            {total} {total === 1 ? "lead" : "leads"}
          </p>
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-muted transition-colors hover:text-brand"
          >
            Ver todos
          </button>
        )}
      </div>
      <div
        role="group"
        aria-label="Filtrar leads por cualificación"
        className="flex gap-2 xl:flex-col xl:gap-1"
      >
        {temperatureOptions.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? "" : option.value)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1.5 rounded-2xl p-2 text-center transition-[background-color,opacity] hover:bg-surface-2 sm:flex-row sm:gap-3 sm:text-left",
                value && !selected && "opacity-50",
              )}
            >
              <span
                className={"temperature-glass semaforo-bulb temperature-" + option.value}
                data-selected={selected}
                aria-hidden="true"
              >
                {selected && <Check className="h-4 w-4" strokeWidth={3} />}
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted">{option.label}</span>
                <span className="block text-2xl font-semibold leading-none tabular-nums text-foreground">
                  {counts[option.value]}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
