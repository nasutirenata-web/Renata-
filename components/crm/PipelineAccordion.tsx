"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type PipelineDeal = { id: string; title: string; value_estimate: number | null };
export type PipelineStage = { key: string; label: string; deals: PipelineDeal[] };

function formatValue(value: number | null) {
  if (value == null) return null;
  return "$" + value.toLocaleString("es-AR");
}

export function PipelineAccordion({ stages }: { stages: PipelineStage[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {stages.map((stage) => {
        const count = stage.deals.length;
        const expandable = count > 0;
        const isOpen = open === stage.key && expandable;

        return (
          <div key={stage.key} className="lead-row rounded-2xl">
            <button
              type="button"
              disabled={!expandable}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : stage.key)}
              className={cn(
                "flex min-h-[64px] w-full items-center justify-between gap-3 px-5 text-left",
                expandable ? "cursor-pointer" : "cursor-default",
              )}
            >
              <span className="text-sm font-semibold text-foreground">{stage.label}</span>
              <span className="flex items-center gap-3">
                <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-surface-2 px-2 text-xs font-medium text-muted">
                  {count}
                </span>
                {expandable && (
                  <ChevronDown
                    className={cn("h-4 w-4 text-muted-2 transition-transform", isOpen && "rotate-180")}
                  />
                )}
              </span>
            </button>

            {isOpen && (
              <ul className="flex flex-col gap-2 px-4 pb-4">
                {stage.deals.map((deal) => (
                  <li
                    key={deal.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-4 py-2.5 text-sm"
                  >
                    <span className="min-w-0 break-words font-medium text-foreground">{deal.title}</span>
                    {formatValue(deal.value_estimate) && (
                      <span className="shrink-0 text-xs text-muted">{formatValue(deal.value_estimate)}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
