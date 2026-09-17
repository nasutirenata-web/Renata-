import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { getOrgContext } from "@/lib/supabase/org";
import { Building2, Users, KanbanSquare, Activity, ArrowUpRight } from "lucide-react";

export default async function CRMPage() {
  const ctx = await getOrgContext();
  const areas = [
    {table:"companies", title:"Empresas", icon:Building2, href:"/crm/empresas", text:"Cuentas objetivo, segmento y contexto de negocio."},
    {table:"contacts", title:"Contactos", icon:Users, href:"/crm/contactos", text:"Personas, cargos y temperatura de interés."},
    {table:"deals", title:"Pipeline", icon:KanbanSquare, href:"/crm/pipeline", text:"Oportunidades y próximos pasos comerciales."},
    {table:"activities", title:"Actividad", icon:Activity, href:"/crm/actividad", text:"Historial de notas, reuniones y seguimiento."},
  ];
  const counts = await Promise.all(areas.map(async a => ctx ? await ctx.supabase.from(a.table).select("*",{count:"exact",head:true}).eq("organization_id",ctx.orgId) : null));
  return <><PageHeader title="CRM" description="Todas tus relaciones comerciales, con contexto y un siguiente paso."/><div className="space-y-6 p-5 sm:p-8">
    {!ctx&&<Card><CardTitle>Tu CRM empieza con una cuenta</CardTitle><CardDescription className="mt-2">Iniciá sesión para gestionar empresas, contactos y oportunidades de tu organización.</CardDescription><LinkButton href="/login" className="mt-4">Ingresar</LinkButton></Card>}
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{areas.map(({icon:Icon,...a},i)=><Card key={a.table} className="flex flex-col"><Icon className="h-6 w-6 text-brand"/><p className="mb-2 mt-6 text-4xl font-display">{counts[i]&&!counts[i]?.error?counts[i]?.count:"—"}</p><CardTitle>{a.title}</CardTitle><CardDescription className="mb-7 mt-2">{a.text}</CardDescription>{counts[i]?.error&&<p className="mb-4 text-xs text-warning">No se pudo consultar esta área. Reintentá más tarde.</p>}<LinkButton href={a.href} variant="outline" className="mt-auto">Abrir <ArrowUpRight className="h-4 w-4"/></LinkButton></Card>)}</div>
  </div></>;
}
