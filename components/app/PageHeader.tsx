export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="capsule-page-header flex flex-wrap items-start justify-between gap-4 border-b border-surface-border/60 px-8 py-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function OriginTabs({ active }: { active: "outbound" | "inbound" }) {
  return (
    <div className="glass-panel flex gap-1 rounded-full p-1 text-sm">
      <a
        href="?origen=outbound"
        className={`rounded-full px-4 py-1.5 transition-colors ${
          active === "outbound" ? "capsule-button-primary" : "text-muted hover:text-foreground"
        }`}
      >
        Outbound
      </a>
      <a
        href="?origen=inbound"
        className={`rounded-full px-4 py-1.5 transition-colors ${
          active === "inbound" ? "bg-brand text-brand-foreground" : "text-muted hover:text-foreground"
        }`}
      >
        Inbound
      </a>
    </div>
  );
}
