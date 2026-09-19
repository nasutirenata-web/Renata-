"use client";

import { useState, useTransition } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mail, Plus, Check } from "lucide-react";
import { saveHunterContacts, type SaveResult } from "@/app/(app)/prospeccion/actions";
import type { HunterEmail } from "@/lib/integrations/hunter";

type RowState = "saved" | "duplicate";

const personName = (e: HunterEmail) => [e.first_name, e.last_name].filter(Boolean).join(" ") || e.value;

export function HunterDomainSearch() {
  const [domain, setDomain] = useState("");
  const [organization, setOrganization] = useState<string | null>(null);
  const [emails, setEmails] = useState<HunterEmail[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rows, setRows] = useState<Record<string, RowState>>({});
  const [outcome, setOutcome] = useState<SaveResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selectable = emails.filter((e) => !rows[e.value]).map((e) => e.value);
  const allSelected = selectable.length > 0 && selectable.every((v) => selected.has(v));

  async function handleSearch() {
    if (!domain.trim()) return;
    setLoading(true);
    setNotice(null);
    setEmails([]);
    setSelected(new Set());
    setRows({});
    setOutcome(null);
    try {
      const res = await fetch("/api/integraciones/hunter/domain-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.message ?? "No se pudo buscar en Hunter.io.");
        return;
      }
      setOrganization(data.organization);
      setEmails(data.emails);
      if (data.emails.length === 0) setNotice("Hunter.io no encontró emails públicos para ese dominio.");
    } catch {
      setNotice("No se pudo conectar con Hunter.io.");
    } finally {
      setLoading(false);
    }
  }

  function toggle(value: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function save() {
    const chosen = emails.filter((e) => selected.has(e.value) && !rows[e.value]);
    if (chosen.length === 0) return;
    startTransition(async () => {
      const res = await saveHunterContacts({
        organization,
        people: chosen.map((e) => ({ fullName: personName(e), email: e.value, roleTitle: e.position })),
      }).catch((): SaveResult => ({ error: "No se pudo conectar con el servidor. No se guardó nada.", saved: [], duplicates: [] }));
      setOutcome(res);
      if (res.error) return;
      const duplicated = new Set(res.duplicates.map((d) => d.slice(d.lastIndexOf("(") + 1, -1).toLowerCase()));
      setRows((prev) => {
        const next = { ...prev };
        for (const e of chosen) next[e.value] = duplicated.has(e.value.toLowerCase()) ? "duplicate" : "saved";
        return next;
      });
      setSelected(new Set());
    });
  }

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <CardTitle>Buscar emails reales (Hunter.io)</CardTitle>
        <CardDescription>
          Dominio de la empresa → emails públicos que Hunter.io asocia a ese dominio. Son datos de un proveedor, no una
          sugerencia de IA. La confianza es su estimación: confirmá antes de escribir.
        </CardDescription>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="ejemplo.com"
          className="flex-1 rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
        <Button size="sm" className="w-fit" onClick={handleSearch} disabled={loading}>
          <Mail className="h-4 w-4" /> {loading ? "Buscando…" : "Buscar emails"}
        </Button>
      </div>
      {notice && <p className="text-xs text-warning">{notice}</p>}

      {emails.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-surface-border">
          <table className="w-full text-sm">
            <thead className="bg-surface/60 text-left text-xs uppercase tracking-wide text-muted-2">
              <tr>
                <th className="w-10 px-4 py-2.5">
                  <input
                    type="checkbox"
                    aria-label="Elegir todos"
                    checked={allSelected}
                    disabled={selectable.length === 0}
                    onChange={() => setSelected(allSelected ? new Set() : new Set(selectable))}
                    className="h-4 w-4 accent-brand"
                  />
                </th>
                <th className="px-2 py-2.5 font-medium">Persona</th>
                <th className="px-2 py-2.5 font-medium">Cargo</th>
                <th className="px-2 py-2.5 font-medium">Confianza</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {emails.map((e) => {
                const state = rows[e.value];
                return (
                  <tr key={e.value} className="bg-surface/30">
                    <td className="px-4 py-2.5">
                      <input
                        type="checkbox"
                        aria-label={`Elegir ${e.value}`}
                        checked={selected.has(e.value)}
                        disabled={Boolean(state)}
                        onChange={() => toggle(e.value)}
                        className="h-4 w-4 accent-brand"
                      />
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="block font-medium text-foreground">{personName(e)}</span>
                      <span className="block text-xs text-muted">{e.value}</span>
                    </td>
                    <td className="px-2 py-2.5 text-muted">{e.position ?? "—"}</td>
                    <td className="px-2 py-2.5 text-muted">{e.confidence}%</td>
                    <td className="px-4 py-2.5 text-right text-xs text-muted">
                      {state && (
                        <span className="inline-flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> {state === "saved" ? "Guardado" : "Ya estaba"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex flex-wrap items-center gap-3 border-t border-surface-border bg-surface/40 px-4 py-3">
            <Button size="sm" onClick={save} disabled={pending || selected.size === 0}>
              <Plus className="h-4 w-4" />
              {pending ? "Guardando…" : `Guardar ${selected.size || ""} en el CRM`.replace("  ", " ")}
            </Button>
            <div role="status" className="min-w-0 flex-1 text-xs">
              {outcome?.error && <p className="text-danger">{outcome.error}</p>}
              {outcome && !outcome.error && (
                <p className="text-muted">
                  {outcome.saved.length > 0 && <span className="text-foreground">Guardados en el CRM: {outcome.saved.join(", ")}. </span>}
                  {outcome.duplicates.length > 0 && <span>Ya estaban, no se duplicaron: {outcome.duplicates.join(", ")}.</span>}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
