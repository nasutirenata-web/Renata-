const items = ["ESTRATEGIA", "DATOS B2B", "CREATIVIDAD", "SOCIAL", "CRM & PIPELINE"];

export function Ticker() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-white/70 bg-white/20 px-5 py-5 text-xs font-medium tracking-[0.2em] text-muted">
      {items.map((item, i) => (
        <span key={item} className="flex items-center gap-8">
          {item}
          {i < items.length - 1 && <span className="text-brand">✳</span>}
        </span>
      ))}
    </div>
  );
}
