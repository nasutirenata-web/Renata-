"use client";

import { useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type ScoredLead = {
  nombre: string;
  empresa: string;
  cargo: string;
  score_total: number;
  temperatura: "cold" | "warm" | "hot";
  accion: string;
};

const TEMPS: Record<ScoredLead["temperatura"], { className: string; label: string }> = {
  cold: { className: "bg-sky-400", label: "Frío" },
  warm: { className: "bg-orange-400", label: "Tibio" },
  hot: { className: "bg-red-500", label: "Caliente" },
};

export function LeadScoringTool() {
  const [icp, setIcp] = useState("");
  const [leads, setLeads] = useState("");
  const [results, setResults] = useState<ScoredLead[]>([]);
  const [overrides, setOverrides] = useState<Record<number, ScoredLead["temperatura"]>>({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setNotice(null);
    setResults([]);
    setOverrides({});
    try {
      const res = await fetch("/api/ai/scoring-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icp, leads }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.message ?? "No se pudo puntuar la lista.");
        return;
      }
      setResults(data.leads);
    } catch {
      setNotice("No se pudo conectar con el servidor de IA.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <Card className="flex flex-col gap-4">
        <Badge tone="neutral" className="w-fit normal-case">
          Outbound · Discover
        </Badge>
        <label className="flex flex-col gap-1.5 text-sm">
          ICP de referencia (opcional)
          <textarea
            rows={3}
            value={icp}
            onChange={(e) => setIcp(e.target.value)}
            className="resize-none rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Lista de leads (nombre, empresa, cargo — uno por línea)
          <textarea
            rows={5}
            value={leads}
            onChange={(e) => setLeads(e.target.value)}
            className="resize-none rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
          />
        </label>
        <Button onClick={handleGenerate} disabled={loading} className="w-fit">
          <Sparkles className="h-4 w-4" /> {loading ? "Puntuando…" : "Generar con IA"}
        </Button>
      </Card>

      {notice && (
        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          {notice}
        </div>
      )}

      {results.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-surface-border">
          <table className="w-full text-sm">
            <thead className="bg-surface/60 text-left text-xs uppercase tracking-wide text-muted-2">
              <tr>
                <th className="px-4 py-3 font-medium">Lead</th>
                <th className="px-4 py-3 font-medium">Empresa</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Temperatura</th>
                <th className="px-4 py-3 font-medium">Próxima acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {results.map((lead, i) => {
                const active = overrides[i] ?? lead.temperatura;
                return (
                  <tr key={i} className="bg-surface/30 align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{lead.nombre}</p>
                      <p className="text-xs text-muted-2">{lead.cargo}</p>
                    </td>
                    <td className="px-4 py-3 text-muted">{lead.empresa}</td>
                    <td className="px-4 py-3 text-foreground/90">{lead.score_total}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {(["cold", "warm", "hot"] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            title={TEMPS[t].label}
                            onClick={() => setOverrides((prev) => ({ ...prev, [i]: t }))}
                            className={cn(
                              "h-5 w-5 rounded-md border-2 transition-transform hover:scale-110",
                              TEMPS[t].className,
                              active === t ? "border-white" : "border-transparent opacity-40",
                            )}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{lead.accion}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-center gap-4 border-t border-surface-border bg-surface/40 px-4 py-2.5 text-xs text-muted-2">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-sky-400" /> Frío (&lt;40)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-orange-400" /> Tibio (40-70)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-red-500" /> Caliente (&gt;70)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
