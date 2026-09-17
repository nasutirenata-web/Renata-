"use client";

import { useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Save, Check } from "lucide-react";

export type StrategyField = {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
};

export function StrategySection({
  title,
  description,
  fields,
}: {
  title: string;
  description: string;
  fields: StrategyField[];
}) {
  const [saved, setSaved] = useState(false);

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="mt-1">{description}</CardDescription>
      </div>
      {fields.map((field) => (
        <label key={field.name} className="flex flex-col gap-1.5 text-sm">
          {field.label}
          <textarea
            rows={field.rows ?? 3}
            placeholder={field.placeholder}
            className="resize-none rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
          />
        </label>
      ))}
      <Button
        size="sm"
        variant="secondary"
        className="w-fit"
        onClick={() => setSaved(true)}
      >
        {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        {saved ? "Guardado en este navegador" : "Guardar borrador"}
      </Button>
      {saved && (
        <p className="text-xs text-muted-2">
          Por ahora esto queda solo en tu navegador. Conectá Supabase en
          Configuración para que se guarde en la organización y alimente al Studio.
        </p>
      )}
    </Card>
  );
}
