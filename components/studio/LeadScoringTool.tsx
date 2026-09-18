"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { setTemperature } from "@/app/(app)/crm/contactos/actions";

export type Temperature = "cold" | "warm" | "hot";

export type ScorableContact = {
  id: string;
  full_name: string;
  role_title: string | null;
  temperature: Temperature;
  company_name: string | null;
};

type ScoreResult = {
  contactId: string;
  score_total: number;
  temperatura: Temperature;
  accion: string;
};

const TEMPS: Record<Temperature, { className: string; label: string }> = {
  cold: { className: "bg-temp-cold", label: "Frío" },
  warm: { className: "bg-temp-warm", label: "Tibio" },
  hot: { className: "bg-temp-hot", label: "Caliente" },
};

const DEMO_CONTACTS: ScorableContact[] = [
  { id: "demo-1", full_name: "Lucía Fernández", role_title: "Encargada de compras", temperature: "cold", company_name: "Comercio Del Centro" },
  { id: "demo-2", full_name: "Martín Gómez", role_title: "Dueño", temperature: "cold", company_name: "Distribuidora San Martín" },
  { id: "demo-3", full_name: "Sofía Ibáñez", role_title: "Gerente de local", temperature: "cold", company_name: "Comercio Norte" },
];

export function LeadScoringTool({
  contacts,
  connected,
}: {
  contacts: ScorableContact[];
  connected: boolean;
}) {
  const isDemo = !connected || contacts.length === 0;
  const effectiveContacts = connected && contacts.length > 0 ? contacts : DEMO_CONTACTS;

  const [selected, setSelected] = useState<Set<string>>(
    new Set(effectiveContacts.map((c) => c.id)),
  );
  const [icp, setIcp] = useState("");
  const [scores, setScores] = useState<Record<string, ScoreResult>>({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const contacts_ = effectiveContacts;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleGenerate() {
    const chosen = contacts_.filter((c) => selected.has(c.id));
    if (chosen.length === 0) return;
    setLoading(true);
    setNotice(null);
    try {
      const leadsText = chosen
        .map((c) => `${c.full_name}, ${c.company_name ?? "sin empresa"}, ${c.role_title ?? "sin cargo"}`)
        .join("\n");
      const res = await fetch("/api/ai/scoring-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icp, leads: leadsText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.message ?? "No se pudo puntuar la lista.");
        return;
      }
      const byIndex: Record<string, ScoreResult> = {};
      (data.leads as { score_total: number; temperatura: Temperature; accion: string }[]).forEach(
        (r, i) => {
          const contact = chosen[i];
          if (contact) {
            byIndex[contact.id] = { contactId: contact.id, ...r };
          }
        },
      );
      setScores(byIndex);
    } catch {
      setNotice("No se pudo conectar con el servidor de IA.");
    } finally {
      setLoading(false);
    }
  }

  function applyTemperature(contactId: string, temp: Temperature) {
    setScores((prev) => ({
      ...prev,
      [contactId]: { ...prev[contactId], contactId, temperatura: temp, score_total: prev[contactId]?.score_total ?? 0, accion: prev[contactId]?.accion ?? "" },
    }));
    if (!isDemo) {
      startTransition(async () => {
        await setTemperature(contactId, temp);
      });
    }
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      {isDemo && (
        <div className="flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          <Badge tone="warning">Modo demo</Badge>
          {!connected
            ? "Conectá Supabase para puntuar tus contactos reales. Mientras tanto, probá la interacción con estos datos de ejemplo (no se guardan)."
            : "Todavía no cargaste contactos. Estos son datos de ejemplo para probar la interacción — no se guardan."}
        </div>
      )}
      <Card className="flex flex-col gap-4">
        <Badge tone="neutral" className="w-fit normal-case">
          Outbound · Discover
        </Badge>
        <label className="flex flex-col gap-1.5 text-sm">
          ICP de referencia (opcional)
          <textarea
            rows={2}
            value={icp}
            onChange={(e) => setIcp(e.target.value)}
            className="resize-none rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
        </label>
        <p className="text-xs text-muted-2">
          Elegí qué contactos de tu CRM puntuar (todos seleccionados por defecto).
        </p>
      </Card>

      <div className="overflow-hidden rounded-3xl border border-surface-border">
        <table className="w-full text-sm">
          <thead className="bg-surface/60 text-left text-xs uppercase tracking-wide text-muted-2">
            <tr>
              <th className="w-10 px-4 py-3"></th>
              <th className="px-4 py-3 font-medium">Contacto</th>
              <th className="px-4 py-3 font-medium">Empresa</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Temperatura</th>
              <th className="px-4 py-3 font-medium">Próxima acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {contacts_.map((c) => {
              const score = scores[c.id];
              const activeTemp = score?.temperatura ?? c.temperature;
              return (
                <tr key={c.id} className="bg-surface/30 align-top">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggle(c.id)}
                      className="h-4 w-4 accent-brand"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{c.full_name}</p>
                    <p className="text-xs text-muted-2">{c.role_title ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{c.company_name ?? "—"}</td>
                  <td className="px-4 py-3 text-foreground/90">{score?.score_total ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {(["cold", "warm", "hot"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          title={TEMPS[t].label}
                          onClick={() => applyTemperature(c.id, t)}
                          className={cn(
                            "h-5 w-5 rounded-md border-2 transition-transform hover:scale-110",
                            TEMPS[t].className,
                            activeTemp === t ? "border-white" : "border-transparent opacity-40",
                          )}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{score?.accion ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex items-center justify-between gap-4 border-t border-surface-border bg-surface/40 px-4 py-3">
          <div className="flex items-center gap-4 text-xs text-muted-2">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-temp-cold" /> Frío
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-temp-warm" /> Tibio
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-temp-hot" /> Caliente
            </span>
          </div>
          <Button size="sm" onClick={handleGenerate} disabled={loading || selected.size === 0}>
            <Sparkles className="h-4 w-4" /> {loading ? "Puntuando…" : `Puntuar ${selected.size} seleccionados`}
          </Button>
        </div>
      </div>

      {notice && (
        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          {notice}
        </div>
      )}
    </div>
  );
}
