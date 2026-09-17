"use client";

import { useState, useTransition } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mail, Plus, Check } from "lucide-react";
import { addHunterEmailToCrm } from "@/app/(app)/prospeccion/actions";
import type { HunterEmail } from "@/lib/integrations/hunter";

export function HunterDomainSearch() {
  const [domain, setDomain] = useState("");
  const [organization, setOrganization] = useState<string | null>(null);
  const [emails, setEmails] = useState<HunterEmail[]>([]);
  const [added, setAdded] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleSearch() {
    if (!domain.trim()) return;
    setLoading(true);
    setNotice(null);
    setEmails([]);
    setAdded({});
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

  function handleAdd(i: number, e: HunterEmail) {
    startTransition(async () => {
      const res = await addHunterEmailToCrm({
        fullName: [e.first_name, e.last_name].filter(Boolean).join(" "),
        email: e.value,
        roleTitle: e.position,
        organization,
      });
      if (!res?.error) setAdded((prev) => ({ ...prev, [i]: true }));
    });
  }

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <CardTitle>Buscar emails reales (Hunter.io)</CardTitle>
        <CardDescription>
          Dominio de la empresa → emails corporativos verificados por Hunter.io. Datos
          reales, no una sugerencia de IA.
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
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Cargo</th>
                <th className="px-4 py-3 font-medium">Confianza</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {emails.map((e, i) => (
                <tr key={e.value} className="bg-surface/30">
                  <td className="px-4 py-3 font-medium text-foreground">{e.value}</td>
                  <td className="px-4 py-3 text-muted">{e.position ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{e.confidence}%</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant={added[i] ? "ghost" : "secondary"}
                      disabled={added[i]}
                      onClick={() => handleAdd(i, e)}
                    >
                      {added[i] ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Agregado
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" /> Agregar al CRM
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
