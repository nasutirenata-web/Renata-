import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  body?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-3xl border border-dashed border-surface-border bg-surface/40 px-6 py-14 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-lime">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <p className="text-base font-medium text-foreground">{title}</p>
      {body && <p className="max-w-sm text-sm text-muted">{body}</p>}
      {action}
    </div>
  );
}
