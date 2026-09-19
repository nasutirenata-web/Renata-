"use client";

import { useState, useTransition } from "react";
import { setTemperature } from "@/app/(app)/crm/contactos/actions";
import { TemperatureControl, type Temperature } from "./TemperatureControl";
import { cn } from "@/lib/utils";

const SAVED = "Guardado";

// value = null significa "Sin cualificar": ningún punto queda marcado hasta que alguien elija uno.
export function TemperaturePicker({
  contactId,
  value,
  compact = false,
}: {
  contactId: string;
  value: Temperature | null;
  compact?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState("");
  const isError = notice !== "" && notice !== SAVED;

  return (
    <div className="flex flex-col items-end">
      <TemperatureControl
        value={value}
        disabled={pending}
        onChange={(temp) =>
          startTransition(async () => {
            setNotice("");
            try {
              const result = await setTemperature(contactId, temp);
              setNotice(result.error ?? SAVED);
            } catch {
              setNotice("No se pudo guardar. Volvé a intentar.");
            }
          })
        }
      />
      <p
        role="status"
        className={cn(compact && !isError ? "sr-only" : "max-w-40 text-right text-[10px]", isError ? "text-danger" : "text-muted")}
      >
        {pending ? "Guardando…" : notice}
      </p>
    </div>
  );
}
