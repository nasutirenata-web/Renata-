import Link from "next/link";
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "capsule-button inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none backdrop-blur-xl";

const variants: Record<Variant, string> = {
  primary:
    "capsule-button-primary text-brand-foreground",
  secondary:
    "capsule-button-aqua",
  ghost: "capsule-button-ghost text-muted hover:bg-white/35 hover:text-brand",
  outline:
    "capsule-button-glass hover:text-brand",
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
