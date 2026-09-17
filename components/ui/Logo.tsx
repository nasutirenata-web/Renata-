import Image from "next/image";
import { cn } from "@/lib/utils";

const ASPECT = 900 / 237;

export function Logo({ className, height = 40 }: { className?: string; height?: number }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/logo-transparent.png"
        alt="Capsule GTM"
        width={Math.round(height * ASPECT)}
        height={height}
        priority
        className="object-contain"
      />
    </span>
  );
}
