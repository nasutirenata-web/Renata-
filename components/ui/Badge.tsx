import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Tone = "brand" | "neutral" | "warning" | "danger" | "ok";

const tones: Record<Tone, string> = {
  brand: "bg-brand/10 text-brand border-brand/30",
  neutral: "bg-surface-2 text-muted border-surface-border",
  warning: "bg-warning/10 text-warning border-warning/30",
  danger: "bg-danger/10 text-danger border-danger/30",
  ok: "bg-ok/10 text-ok border-ok/30",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: { tone?: Tone } & ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function StatusDot({ tone = "neutral" }: { tone?: Tone }) {
  const dot: Record<Tone, string> = {
    brand: "bg-brand",
    neutral: "bg-muted-2",
    warning: "bg-warning",
    danger: "bg-danger",
    ok: "bg-ok",
  };
  return <span className={cn("h-1.5 w-1.5 rounded-full", dot[tone])} />;
}
