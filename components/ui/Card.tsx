import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-lime/20 bg-lime/[0.07] p-6 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_24px_-14px_rgba(212,255,92,0.9)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3 className={cn("text-lg font-semibold text-foreground", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted leading-relaxed", className)} {...props} />
  );
}
