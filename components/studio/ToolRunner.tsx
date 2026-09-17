"use client";

import { useState } from "react";
import { type SkillTool } from "@/lib/skills-registry";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Copy, Check } from "lucide-react";
import { markdownLiteToHtml } from "@/lib/utils";

export function ToolRunner({ tool }: { tool: SkillTool }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setNotice(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: tool.slug, inputs: values }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.message ?? "No se pudo generar el contenido.");
        return;
      }
      setResult(data.result);
    } catch {
      setNotice("No se pudo conectar con el servidor de IA.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="grid gap-6 p-8 lg:grid-cols-2">
      <Card className="flex flex-col gap-4">
        <Badge tone="neutral" className="w-fit normal-case">
          {tool.module}
        </Badge>
        {tool.fields.map((field) => (
          <label key={field.name} className="flex flex-col gap-1.5 text-sm">
            {field.label}
            {field.type === "textarea" ? (
              <textarea
                rows={4}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                className="resize-none rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
              />
            ) : (
              <input
                type="text"
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
              />
            )}
          </label>
        ))}
        <Button onClick={handleGenerate} disabled={loading} className="mt-2 w-fit">
          <Sparkles className="h-4 w-4" />
          {loading ? "Generando…" : "Generar con IA"}
        </Button>
      </Card>

      <Card className="flex flex-col">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Resultado</p>
          {result && (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-lime"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          )}
        </div>
        <div className="mt-4 flex-1">
          {notice && (
            <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
              {notice}
            </div>
          )}
          {!notice && !result && !loading && (
            <div className="flex h-full min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-surface-border text-sm text-muted-2">
              El resultado va a aparecer acá.
            </div>
          )}
          {loading && (
            <div className="flex h-full min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-surface-border text-sm text-muted-2">
              Generando con IA…
            </div>
          )}
          {result && (
            <div
              className="whitespace-pre-wrap rounded-2xl border border-surface-border bg-surface-2 p-4 font-sans text-sm leading-relaxed text-foreground/90"
              dangerouslySetInnerHTML={{ __html: markdownLiteToHtml(result) }}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
