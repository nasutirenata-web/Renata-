"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Download } from "lucide-react";

const FORMATS = {
  post: { label: "Post (1:1)", w: 1080, h: 1080 },
  carrusel: { label: "Carrusel (4:5)", w: 1080, h: 1350 },
  story: { label: "Story (9:16)", w: 1080, h: 1920 },
} as const;

type FormatKey = keyof typeof FORMATS;
type Style = "oscuro" | "lima";

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let lines = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + lines * lineHeight);
      line = word;
      lines += 1;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, y + lines * lineHeight);
  return lines + 1;
}

export function ImageDesigner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [format, setFormat] = useState<FormatKey>("post");
  const [style, setStyle] = useState<Style>("oscuro");
  const [eyebrow, setEyebrow] = useState("CAPSULE GTM");
  const [headline, setHeadline] = useState("De primer contacto a primer pedido");
  const [subheadline, setSubheadline] = useState("Sistema comercial B2B para farmacias y comercios");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { w, h } = FORMATS[format];
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dark = "#131417";
    const lime = "#d4ff5c";
    const limeForeground = "#10120a";
    const isLime = style === "lima";

    ctx.fillStyle = isLime ? lime : dark;
    ctx.fillRect(0, 0, w, h);

    if (!isLime) {
      const grad = ctx.createRadialGradient(w / 2, 0, 0, w / 2, 0, w * 0.9);
      grad.addColorStop(0, "rgba(212,255,92,0.18)");
      grad.addColorStop(1, "rgba(212,255,92,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h * 0.6);
    }

    const pad = w * 0.08;
    const textColor = isLime ? limeForeground : "#f4f5f1";
    const mutedColor = isLime ? "#2c2f1a" : "#9ca0a8";

    // capsule mark
    ctx.save();
    ctx.translate(pad + 26, pad + 26);
    ctx.rotate(-Math.PI / 4);
    roundRect(ctx, -34, -16, 68, 32, 16);
    ctx.fillStyle = isLime ? limeForeground : lime;
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = textColor;
    ctx.font = "600 34px Arial";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("capsule", pad + 68, pad + 38);
    const capsuleWidth = ctx.measureText("capsule").width;
    ctx.font = "500 16px Arial";
    ctx.fillStyle = isLime ? limeForeground : lime;
    ctx.fillText("GTM", pad + 68 + capsuleWidth + 12, pad + 38);

    ctx.fillStyle = isLime ? limeForeground : lime;
    ctx.font = "600 22px Arial";
    ctx.fillText(eyebrow.toUpperCase(), pad, h * 0.42);

    ctx.fillStyle = textColor;
    ctx.font = "600 64px Arial";
    const headlineLines = wrapText(ctx, headline, pad, h * 0.42 + 70, w - pad * 2, 72);

    ctx.fillStyle = mutedColor;
    ctx.font = "400 30px Arial";
    wrapText(ctx, subheadline, pad, h * 0.42 + 70 + headlineLines * 72 + 20, w - pad * 2, 40);

    roundRect(ctx, pad, h - pad - 64, 280, 64, 32);
    ctx.fillStyle = isLime ? limeForeground : lime;
    ctx.fill();
    ctx.fillStyle = isLime ? lime : limeForeground;
    ctx.font = "600 24px Arial";
    ctx.fillText("Ver más", pad + 40, h - pad - 24);
  }, [format, style, eyebrow, headline, subheadline]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `capsule-gtm-${format}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="grid gap-6 p-8 lg:grid-cols-[360px_1fr]">
      <Card className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          Formato
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as FormatKey)}
            className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
          >
            {Object.entries(FORMATS).map(([key, f]) => (
              <option key={key} value={key}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Estilo
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as Style)}
            className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
          >
            <option value="oscuro">Fondo oscuro</option>
            <option value="lima">Bloque lima</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Etiqueta
          <input
            value={eyebrow}
            onChange={(e) => setEyebrow(e.target.value)}
            className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Titular
          <textarea
            rows={3}
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="resize-none rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Subtítulo
          <textarea
            rows={2}
            value={subheadline}
            onChange={(e) => setSubheadline(e.target.value)}
            className="resize-none rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
          />
        </label>
        <Button onClick={handleDownload} className="mt-2 w-fit">
          <Download className="h-4 w-4" /> Descargar PNG
        </Button>
        <p className="text-xs text-muted-2">
          Composición generada en el navegador, sin proveedor externo. Para
          generación de imágenes con IA, configurá un proveedor en Integraciones.
        </p>
      </Card>
      <div className="flex items-center justify-center rounded-3xl border border-surface-border bg-surface/40 p-6">
        <canvas
          ref={canvasRef}
          className="max-h-[70vh] w-auto max-w-full rounded-2xl border border-surface-border shadow-2xl"
        />
      </div>
    </div>
  );
}
