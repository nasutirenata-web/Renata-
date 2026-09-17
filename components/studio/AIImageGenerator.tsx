"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sparkles, Download } from "lucide-react";

const RATIOS = [
  { value: "1:1", label: "Post (1:1)" },
  { value: "4:5", label: "Carrusel (4:5)" },
  { value: "9:16", label: "Story (9:16)" },
  { value: "16:9", label: "Horizontal (16:9)" },
] as const;

export function AIImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<(typeof RATIOS)[number]["value"]>("1:1");
  const [image, setImage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setNotice(null);
    setImage(null);
    try {
      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.message ?? "No se pudo generar la imagen.");
        return;
      }
      setImage(data.dataUrl);
    } catch {
      setNotice("No se pudo conectar con el servidor de IA.");
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!image) return;
    const link = document.createElement("a");
    link.download = "capsule-gtm-ia.jpg";
    link.href = image;
    link.click();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Generar con IA · Nano Banana
        </p>
        <label className="flex flex-col gap-1.5 text-sm">
          Idea de la imagen
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej: infografía minimalista mostrando el funnel de contacto a primer pedido, vidrio translúcido en turquesa y violeta"
            className="resize-none rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Formato
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as typeof aspectRatio)}
            className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
          >
            {RATIOS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <Button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="w-fit">
          <Sparkles className="h-4 w-4" />
          {loading ? "Generando…" : "Generar imagen"}
        </Button>
        <p className="text-xs text-muted-2">
          Cada imagen consume créditos de tu cuenta de Gemini. Requiere GEMINI_API_KEY
          configurada en el servidor.
        </p>
      </Card>

      <div className="flex items-center justify-center rounded-3xl border border-surface-border bg-surface/40 p-6">
        {notice && (
          <div className="max-w-sm rounded-2xl border border-warning/30 bg-warning/10 p-4 text-center text-sm text-warning">
            {notice}
          </div>
        )}
        {!notice && !image && !loading && (
          <p className="text-sm text-muted-2">La imagen generada va a aparecer acá.</p>
        )}
        {loading && <p className="text-sm text-muted-2">Generando con Nano Banana…</p>}
        {image && (
          <div className="flex flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="Imagen generada con IA"
              className="max-h-[60vh] w-auto max-w-full rounded-2xl border border-surface-border shadow-2xl"
            />
            <Button size="sm" variant="secondary" onClick={handleDownload}>
              <Download className="h-4 w-4" /> Descargar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
