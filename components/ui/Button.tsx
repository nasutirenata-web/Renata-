import Link from "next/link";
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background backdrop-blur-xl";

const variants: Record<Variant, string> = {
  primary:
    "bg-lime/70 text-lime-foreground border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-6px_12px_rgba(0,0,0,0.06),0_0_30px_-2px_rgba(212,255,92,0.85)] hover:bg-lime/85 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-6px_12px_rgba(0,0,0,0.06),0_0_38px_-2px_rgba(212,255,92,1)]",
  secondary:
    "bg-white/[0.14] text-foreground border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-white/[0.2] hover:border-lime/40 hover:text-lime",
  ghost: "text-foreground/80 hover:text-lime hover:bg-white/[0.1]",
  outline:
    "border border-white/25 text-foreground bg-white/[0.08] hover:border-lime hover:text-lime",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-6 py-3.5",
};

type ButtonOwnProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonOwnProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: ButtonOwnProps & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
