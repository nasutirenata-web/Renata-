import Image from "next/image";
import { cn } from "@/lib/utils";

const ASPECT = 2170 / 725;

export function Logo({ className, height = 54 }: { className?: string; height?: number }) {
  return (
    <span className={cn("capsule-logo inline-flex items-center", className)}>
      <Image
        src="/logo-liquid-glass.png"
        alt="Capsule GTM"
        width={Math.round(height * ASPECT)}
        height={height}
        priority
        className="h-auto max-w-full object-contain"
      />
    </span>
  );
}
