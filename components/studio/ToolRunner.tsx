"use client";

import { useState } from "react";
import { type SkillTool } from "@/lib/skills-registry";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Copy, Check, ImageIcon, Download, Mail } from "lucide-react";
import { markdownLiteToHtml } from "@/lib/utils";

type KnownContact = { full_name: string; role_title: string | null; email: string | null };

export function ToolRunner({
  tool,
  knownContacts = [],
}: {
  tool: SkillTool;
  knownContacts?: KnownContact[];
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageNotice, setImageNotice] = useState<string | null>(null);

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

  async function handleGenerateImage() {
    if (!result) return;
    setImageLoading(true);
    setImageNotice(null);
    setImage(null);
    try {
      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: result, aspectRatio: "1:1" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImageNotice(data.message ?? "No se pudo generar la imagen.");
        return;
      }
      setImage(data.dataUrl);
    } catch {
      setImageNotice("No se pudo conectar con el servidor de IA.");
    } finally {
      setImageLoading(false);
    }
  }

  function handleDownloadImage() {
    if (!image) return;
    const link = document.createElement("a");
    link.download = "capsule-gtm-brief.jpg";
    link.href = image;
    link.click();
  }

  function handleContactNameChange(name: string) {
    setValues((v) => ({ ...v, nombre: name }));
    const match = knownContacts.find((c) => c.full_name.toLowerCase() === name.toLowerCase());
    if (match) {
      setValues((v) => ({
        ...v,
        nombre: name,
        cargo: match.role_title ?? v.cargo ?? "",
        email: match.email ?? v.email ?? "",
      }));
    }
  }

  const emailField = tool.fields.find((f) => f.type === "email");
  const mailtoHref =
    result && emailField && values[emailField.name]
      ? `mailto:${encodeURIComponent(values[emailField.name])}?subject=${encodeURIComponent(tool.title)}&body=${encodeURIComponent(result)}`
      : null;

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
                className="resize-none rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
              />
            ) : field.type === "contact-name" ? (
              <>
                <input
                  type="text"
                  list="known-contacts"
                  required={field.required}
                  placeholder={field.placeholder ?? "Escribí o elegí un contacto guardado"}
                  value={values[field.name] ?? ""}
                  onChange={(e) => handleContactNameChange(e.target.value)}
                  className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
                />
                <datalist id="known-contacts">
                  {knownContacts.map((c) => (
                    <option key={c.full_name} value={c.full_name} />
                  ))}
                </datalist>
              </>
            ) : (
              <input
                type={field.type === "email" ? "email" : "text"}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
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
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-brand"
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
          {result && emailField && (
            <div className="mt-4">
              {mailtoHref ? (
                <a
                  href={mailtoHref}
                  className="capsule-button capsule-button-aqua inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-display font-semibold backdrop-blur-xl transition-all duration-200"
                >
                  <Mail className="h-4 w-4" /> Abrir borrador en tu correo
                </a>
              ) : (
                <p className="text-xs text-muted-2">
                  Completá «{emailField.label}» para abrir el borrador en tu aplicación de correo.
                </p>
              )}
            </div>
          )}
          {result && tool.slug === "briefing-diseno" && (
            <div className="mt-4 flex flex-col gap-3">
              <Button
                onClick={handleGenerateImage}
                disabled={imageLoading}
                variant="secondary"
                size="sm"
                className="w-fit"
              >
                <ImageIcon className="h-4 w-4" />
                {imageLoading ? "Generando imagen…" : "Generar imagen con este brief"}
              </Button>
              {imageNotice && (
                <p className="text-xs text-warning">{imageNotice}</p>
              )}
              {image && (
                <div className="flex flex-col items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt="Imagen generada a partir del brief"
                    className="max-h-[50vh] w-auto max-w-full rounded-2xl border border-surface-border shadow-2xl"
                  />
                  <Button size="sm" variant="ghost" onClick={handleDownloadImage}>
                    <Download className="h-4 w-4" /> Descargar
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
