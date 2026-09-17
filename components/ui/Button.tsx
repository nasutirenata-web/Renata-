import Link from "next/link";
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variants: Record<Variant, string> = {
  primary: "bg-lime text-lime-foreground hover:bg-lime-dim",
  secondary: "bg-surface-2 text-foreground border border-surface-border hover:border-lime/40 hover:text-lime",
  ghost: "text-foreground/80 hover:text-lime hover:bg-surface",
  outline: "border border-surface-border text-foreground hover:border-lime hover:text-lime bg-transparent",
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
