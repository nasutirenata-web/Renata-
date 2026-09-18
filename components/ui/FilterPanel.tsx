"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const pillField =
  "w-full rounded-full border border-surface-border bg-surface-2 px-4 py-2 text-sm outline-none focus:border-brand";

export function FilterPanel({ className, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      className={cn("glass-panel flex flex-col gap-4 rounded-3xl p-5 lg:sticky lg:top-24 lg:self-start", className)}
      {...props}
    />
  );
}

export function FilterGroup({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <div className="border-t border-surface-border/60 py-3 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 text-left text-sm font-semibold text-foreground"
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 text-muted-2 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-3 flex flex-col gap-2">{children}</div>}
    </div>
  );
}

export function RadioOptions({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: string; label: string; dotClass?: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-col gap-1.5">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(selected ? "" : option.value)}
            className="flex items-center gap-2.5 rounded-full px-1 py-1 text-left text-sm text-muted transition-colors hover:text-foreground"
          >
            <span
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                selected ? "border-brand" : "border-surface-border bg-surface-2",
              )}
            >
              {selected && <span className="h-2 w-2 rounded-full bg-brand" />}
            </span>
            {option.dotClass && <span className={cn("h-2.5 w-2.5 rounded-full", option.dotClass)} />}
            <span className={cn(selected && "font-medium text-foreground")}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
