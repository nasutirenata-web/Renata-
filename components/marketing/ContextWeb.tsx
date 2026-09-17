const nodes = [
  { label: "Estrategia", angle: -55, dist: 1 },
  { label: "Datos & señales", angle: -160, dist: 1 },
  { label: "Pipeline", angle: 20, dist: 1 },
  { label: "Contenido", angle: -110, dist: 0.55 },
  { label: "Conversaciones", angle: 75, dist: 0.85 },
];

export function ContextWeb() {
  const cx = 220;
  const cy = 220;
  const r = 150;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <svg viewBox="0 0 440 440" className="h-full w-full overflow-visible">
        {[80, 130, 180].map((radius) => (
          <circle
            key={radius}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="rgba(212,255,92,0.12)"
            strokeWidth="1"
          />
        ))}
        {nodes.map((n) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = cx + Math.cos(rad) * r * n.dist;
          const y = cy + Math.sin(rad) * r * n.dist;
          return (
            <line
              key={n.label}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="rgba(212,255,92,0.35)"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
      <div className="absolute left-1/2 top-1/2 flex w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-full border border-lime/40 bg-lime/90 px-6 py-5 text-center shadow-[0_0_40px_-8px_rgba(212,255,92,0.6)]">
        <span className="text-base font-semibold text-lime-foreground">capsule</span>
        <span className="text-[0.65rem] text-lime-foreground/70">Tu negocio, conectado</span>
      </div>
      {nodes.map((n) => {
        const rad = (n.angle * Math.PI) / 180;
        const x = 50 + Math.cos(rad) * 34 * n.dist;
        const y = 50 + Math.sin(rad) * 34 * n.dist;
        return (
          <span
            key={n.label}
            style={{ left: `${x}%`, top: `${y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-foreground/80 backdrop-blur-xl"
          >
            {n.label}
          </span>
        );
      })}
    </div>
  );
}
