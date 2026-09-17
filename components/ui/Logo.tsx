import { cn } from "@/lib/utils";

export function Logo({ className, textClassName }: { className?: string; textClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="capsuleGrad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EFFFC2" />
            <stop offset="55%" stopColor="#D4FF5C" />
            <stop offset="100%" stopColor="#8FBF2E" />
          </linearGradient>
        </defs>
        <g transform="rotate(-45 20 20)">
          <rect x="7" y="14" width="26" height="12" rx="6" fill="url(#capsuleGrad)" />
          <path d="M20 14 h6 a6 6 0 0 1 0 12 h-6 z" fill="#0f1006" fillOpacity="0.28" />
        </g>
      </svg>
      <span className={cn("flex items-baseline gap-1.5", textClassName)}>
        <span className="text-lg font-semibold tracking-tight text-foreground">capsule</span>
        <span className="font-mono text-[0.65rem] font-medium tracking-[0.25em] text-lime">GTM</span>
      </span>
    </span>
  );
}
