"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, Save, ArrowLeft, ArrowRight, FileDown, Check } from "lucide-react";
import { strategyAreas, allSteps, sectionKey } from "@/lib/strategy-steps";
import { EmailChannelSection } from "@/components/app/EmailChannelSection";
import { cn } from "@/lib/utils";

const EMAIL_CHANNEL_KEY = sectionKey("/build/canales", "Canal de email");

type Values = Record<string, Record<string, string>>;

export function StrategyWizard({
  initialAreaId,
  organizationName,
}: {
  initialAreaId: string;
  organizationName: string;
}) {
  const startIndex = Math.max(
    0,
    allSteps.findIndex((s) => s.area.id === initialAreaId),
  );

  const [values, setValues] = useState<Values>({});
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(startIndex);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");

  const [showAi, setShowAi] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [generating, setGenerating] = useState(false);
  const [aiNotice, setAiNotice] = useState("");

  const totalSteps = allSteps.length + 1; // + final PDF step
  const isFinal = stepIndex >= allSteps.length;
  const current = isFinal ? null : allSteps[stepIndex];

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/strategy", { signal: controller.signal })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error);
        const next: Values = {};
        for (const [key, entry] of Object.entries(data.sections ?? {})) {
          next[key] = (entry as { values: Record<string, string> }).values ?? {};
        }
        setValues(next);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setNotice(e.message ?? "No se pudieron cargar tus borradores.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  async function saveStep() {
    if (!current) return true;
    setSaving(true);
    setNotice("");
    try {
      const res = await fetch("/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: current.key, values: values[current.key] ?? {} }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaved(true);
      return true;
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "No se pudo guardar.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function goTo(index: number) {
    await saveStep();
    setSaved(false);
    setStepIndex(Math.min(Math.max(index, 0), allSteps.length));
  }

  async function handleGenerate() {
    if (!descripcion.trim()) return;
    setGenerating(true);
    setAiNotice("");
    try {
      const res = await fetch("/api/ai/generar-estrategia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiNotice(data.message ?? "No se pudo generar la estrategia.");
        return;
      }
      setValues((prev) => ({ ...prev, ...data.sections }));
      setShowAi(false);
      setAiNotice("");
    } catch {
      setAiNotice("No se pudo conectar con el servidor de IA.");
    } finally {
      setGenerating(false);
    }
  }

  function handleDownloadPdf() {
    import("@/lib/generate-strategy-pdf").then(({ generateStrategyPdf }) => {
      generateStrategyPdf(values, organizationName || "Capsule GTM");
    });
  }

  const fieldClass =
    "resize-y rounded-2xl border border-surface-border bg-surface-2 px-4 py-3 text-base leading-relaxed outline-none focus:border-brand disabled:opacity-50";

  return (
    <div className="flex flex-col gap-6">
      {/* Área stepper */}
      <div className="flex flex-wrap gap-2">
        {strategyAreas.map((area) => {
          const firstIndex = allSteps.findIndex((s) => s.area.id === area.id);
          const lastIndex = allSteps.map((s) => s.area.id).lastIndexOf(area.id);
          const isCurrentArea = !isFinal && current?.area.id === area.id;
          const isDone = stepIndex > lastIndex;
          return (
            <button
              key={area.id}
              type="button"
              onClick={() => goTo(firstIndex)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                isCurrentArea
                  ? "border-brand bg-brand/10 text-brand"
                  : isDone
                    ? "border-ok/30 bg-ok/10 text-ok"
                    : "border-surface-border bg-surface-2 text-muted hover:text-foreground",
              )}
            >
              {isDone && <Check className="mr-1 inline h-3 w-3" />}
              {area.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => goTo(allSteps.length)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
            isFinal ? "border-brand bg-brand/10 text-brand" : "border-surface-border bg-surface-2 text-muted hover:text-foreground",
          )}
        >
          <FileDown className="mr-1 inline h-3 w-3" />
          PDF final
        </button>
      </div>

      {/* Generar con IA */}
      <Card className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setShowAi((v) => !v)}
          className="flex items-center gap-2 text-left text-sm font-semibold text-brand"
        >
          <Sparkles className="h-4 w-4" />
          Generar todo con IA a partir de una descripción
        </button>
        {showAi && (
          <div className="flex flex-col gap-3">
            <CardDescription>
              Contanos de qué trata tu negocio en un párrafo. La IA arma un primer borrador de
              las {allSteps.length} secciones (estrategia, ICP, oferta, precios y canales) para
              que después las revises y ajustes vos — no reemplaza tu criterio, es un punto de
              partida.
            </CardDescription>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              placeholder="Ej: Vendemos software de gestión de turnos para peluquerías y barberías en Argentina, suscripción mensual..."
              className={fieldClass}
            />
            <Button size="sm" className="w-fit" onClick={handleGenerate} disabled={generating}>
              <Sparkles className="h-4 w-4" />
              {generating ? "Generando…" : "Generar borrador completo"}
            </Button>
            {aiNotice && <p className="text-xs text-warning">{aiNotice}</p>}
          </div>
        )}
      </Card>

      <p className="text-xs uppercase tracking-wide text-muted-2">
        Paso {Math.min(stepIndex + 1, totalSteps)} de {totalSteps}
      </p>

      {!isFinal && current && (
        <div className="flex flex-col gap-4">
          {current.key === EMAIL_CHANNEL_KEY ? (
            <EmailChannelSection
              values={values[current.key] ?? {}}
              disabled={loading}
              onChange={(name, value) => {
                setValues((prev) => ({
                  ...prev,
                  [current.key]: { ...prev[current.key], [name]: value },
                }));
                setSaved(false);
              }}
            />
          ) : (
            <Card className="flex flex-col gap-4">
              <div>
                <CardTitle>{current.section.title}</CardTitle>
                <CardDescription className="mt-1">{current.section.description}</CardDescription>
              </div>
              {current.section.fields.map((f) => (
                <label key={f.name} className="flex flex-col gap-2 text-sm">
                  {f.label}
                  <textarea
                    rows={f.rows ?? 3}
                    placeholder={f.placeholder}
                    disabled={loading}
                    value={values[current.key]?.[f.name] ?? ""}
                    onChange={(e) => {
                      setValues((prev) => ({
                        ...prev,
                        [current.key]: { ...prev[current.key], [f.name]: e.target.value },
                      }));
                      setSaved(false);
                    }}
                    className={fieldClass}
                  />
                </label>
              ))}
            </Card>
          )}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button size="sm" variant="ghost" onClick={() => goTo(stepIndex - 1)} disabled={stepIndex === 0}>
              <ArrowLeft className="h-4 w-4" /> Atrás
            </Button>
            <div className="flex items-center gap-3">
              <p role="status" className={cn("text-xs", notice ? "text-warning" : "text-muted")}>
                {loading ? "Cargando…" : notice || (saved ? "Guardado" : "")}
              </p>
              <Button size="sm" variant="secondary" onClick={saveStep} disabled={saving}>
                <Save className="h-4 w-4" /> {saving ? "Guardando…" : "Guardar"}
              </Button>
              <Button size="sm" onClick={() => goTo(stepIndex + 1)} disabled={saving}>
                {stepIndex === allSteps.length - 1 ? "Ir al PDF" : "Continuar"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {isFinal && (
        <Card className="flex flex-col items-start gap-4">
          <div>
            <CardTitle>Tu estrategia está lista</CardTitle>
            <CardDescription className="mt-1">
              Descargá el documento con toda la estrategia — estrategia B2B, cliente ideal,
              oferta, precios y canales — en un solo PDF listo para compartir con tu equipo.
            </CardDescription>
          </div>
          <Button onClick={handleDownloadPdf}>
            <FileDown className="h-4 w-4" /> Descargar PDF
          </Button>
          <Button size="sm" variant="ghost" onClick={() => goTo(allSteps.length - 1)}>
            <ArrowLeft className="h-4 w-4" /> Volver a revisar
          </Button>
        </Card>
      )}
    </div>
  );
}
