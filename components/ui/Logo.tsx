import Image from "next/image";
import { cn } from "@/lib/utils";

const ASPECT = 2170 / 725;

// Dos versiones del mismo logo: la oscura lleva la palabra en verde agua para que
// se lea sobre fondo oscuro. El CSS muestra una u otra según data-theme.
export function Logo({ className, height = 54 }: { className?: string; height?: number }) {
  const size = { width: Math.round(height * ASPECT), height };
  const imageClass = "h-auto max-w-full object-contain";
  return (
    <span className={cn("capsule-logo inline-flex items-center", className)}>
      <Image src="/logo-liquid-glass.png" alt="Capsule GTM" {...size} priority className={cn("logo-light", imageClass)} />
      <Image src="/logo-liquid-glass-dark.png" alt="" aria-hidden="true" {...size} loading="eager" className={cn("logo-dark", imageClass)} />
    </span>
  );
}
