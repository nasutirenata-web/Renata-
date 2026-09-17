"use client";

import { useTransition } from "react";
import { setTemperature } from "@/app/(app)/crm/contactos/actions";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "cold" as const, label: "Frío", className: "bg-sky-400" },
  { value: "warm" as const, label: "Tibio", className: "bg-orange-400" },
  { value: "hot" as const, label: "Caliente", className: "bg-red-500" },
];

export function TemperaturePicker({
  contactId,
  value,
}: {
  contactId: string;
  value: "cold" | "warm" | "hot";
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          title={opt.label}
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await setTemperature(contactId, opt.value);
            })
          }
          className={cn(
            "h-5 w-5 rounded-md border-2 transition-transform hover:scale-110 disabled:opacity-50",
            opt.className,
            value === opt.value ? "border-white" : "border-transparent opacity-40",
          )}
        />
      ))}
    </div>
  );
}
