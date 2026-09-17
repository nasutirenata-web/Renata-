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
          <linearGradient id="capsuleGrad" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#EFFFC2" />
            <stop offset="65%" stopColor="#D4FF5C" />
            <stop offset="100%" stopColor="#7FAE22" />
          </linearGradient>
          <radialGradient id="capsuleHighlight" cx="30%" cy="25%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <filter id="capsuleGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g transform="rotate(-45 20 20)" filter="url(#capsuleGlow)">
          <rect x="6" y="13" width="28" height="14" rx="7" fill="url(#capsuleGrad)" />
          <rect x="6" y="13" width="28" height="14" rx="7" fill="url(#capsuleHighlight)" />
          <path d="M20 13 h7 a7 7 0 0 1 0 14 h-7 z" fill="#0a0c05" fillOpacity="0.35" />
        </g>
      </svg>
      <span className={cn("flex items-baseline gap-1.5", textClassName)}>
        <span className="text-lg font-semibold tracking-tight text-foreground">capsule</span>
        <span className="font-mono text-[0.65rem] font-medium tracking-[0.25em] text-lime">GTM</span>
      </span>
    </span>
  );
}
