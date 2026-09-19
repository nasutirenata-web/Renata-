"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { createDeal } from "@/app/(app)/crm/pipeline/actions";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
export type DealPerson = { id: string; full_name: string; company_id: string | null; origin?: string };
const field = "w-full rounded-xl border border-surface-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-brand";
export function NewDealForm({ origin, companies, contacts = [] }: { origin: "outbound" | "inbound"; companies: {id:string;name:string}[]; contacts?: DealPerson[] }) {
  const [open,setOpen]=useState(false); const [companyId,setCompanyId]=useState(""); const [contactId,setContactId]=useState("");
  const [customTitle,setCustomTitle]=useState<string|null>(null); const [error,setError]=useState<string|null>(null); const [pending,start]=useTransition();
  const company=companies.find(c=>c.id===companyId);
  const people=contacts.filter(c=>c.company_id===companyId);
  const suggested=company ? company.name + " — Nueva oportunidad" : "";
  if(!open) return <Button size="sm" onClick={()=>setOpen(true)}><Plus className="h-4 w-4"/>Nueva oportunidad</Button>;
  return <form action={form=>{setError(null);start(async()=>{const result=await createDeal(form);if(result.error)setError(result.error);else {setOpen(false);setCompanyId("");setContactId("");setCustomTitle(null);}});}} className="glass-panel grid w-full gap-3 rounded-2xl p-4 sm:grid-cols-2">
    <input type="hidden" name="origin" value={contacts.find(c=>c.id===contactId)?.origin ?? origin}/>
    <label className="text-xs text-muted">Empresa potencial cliente<select name="company_id" required value={companyId} disabled={pending} onChange={e=>{setCompanyId(e.target.value);setCustomTitle(null);const list=contacts.filter(c=>c.company_id===e.target.value);setContactId(list.length===1?list[0].id:"");}} className={field}><option value="">Seleccioná una empresa del CRM</option>{companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    <label className="text-xs text-muted">Persona de contacto<select name="contact_id" value={contactId} disabled={pending||!companyId} onChange={e=>setContactId(e.target.value)} className={field}><option value="">{people.length ? "Seleccioná una persona" : "Sin contacto asociado todavía"}</option>{people.map(c=><option key={c.id} value={c.id}>{c.full_name}</option>)}</select></label>
    <label className="text-xs text-muted sm:col-span-2">Nombre de la oportunidad · sugerido automáticamente<input name="title" required maxLength={200} value={customTitle??suggested} disabled={pending} onChange={e=>setCustomTitle(e.target.value)} className={field}/></label>
    <details className="sm:col-span-2"><summary className="cursor-pointer text-xs text-muted">Monto y etapa · opcionales</summary><div className="mt-3 grid gap-3 sm:grid-cols-3">
      <label className="text-xs">Etapa<select name="stage" defaultValue="contacto" className={field}>{[["contacto","Primer contacto"],["interes","Interés"],["reunion","Reunión"],["pedido","Primer pedido"],["cliente","Cliente activo"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
      <label className="text-xs">Monto estimado<input name="value" type="number" min="0" step="0.01" placeholder="Sin estimar" className={field}/></label>
      <label className="text-xs">Moneda<select name="currency" defaultValue="USD" className={field}><option>USD</option><option>ARS</option></select></label>
    </div></details>
    {!companies.length&&<Link href="/prospeccion" className="text-sm text-brand">Buscá y guardá una empresa para empezar →</Link>}
    <div className="flex gap-2 sm:col-span-2"><Button type="submit" size="sm" disabled={pending||!companyId}>{pending?"Creando…":"Crear oportunidad"}</Button><Button type="button" variant="ghost" disabled={pending} onClick={()=>setOpen(false)}>Cancelar</Button></div>
    {error&&<p role="alert" className="text-xs text-danger sm:col-span-2">{error}</p>}
  </form>;
}
