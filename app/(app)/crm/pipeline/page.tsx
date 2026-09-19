import { CrmRefresh } from "@/components/crm/CrmRefresh";
import { PageHeader, OriginTabs } from "@/components/app/PageHeader";
import { NewDealForm } from "@/components/crm/NewDealForm";
import { PipelineBoard, type DealContact, type PipelineDeal } from "@/components/crm/PipelineBoard";
import { getOrgContext } from "@/lib/supabase/org";
import { loadQualifiedContactIds, qualificationOf, type Temperature } from "@/lib/qualification";

const stages = [
  { key: "contacto", label: "Primer contacto" },
  { key: "interes", label: "Interés" },
  { key: "reunion", label: "Reunión" },
  { key: "pedido", label: "Primer pedido" },
  { key: "cliente", label: "Cliente activo" },
];

// Para mostrar primero al contacto más avanzado; sin cualificar va al final.
const RANK: Record<Temperature, number> = { hot: 0, warm: 1, cold: 2 };
const rankOf = (q: Temperature | null) => (q ? RANK[q] : 3);

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ origen?: string }>;
}) {
  const { origen } = await searchParams;
  const active = origen === "inbound" ? "inbound" : "outbound";

  const ctx = await getOrgContext();

  let loadFailed = false;
  let people: {id:string;full_name:string;company_id:string|null;origin:string}[] = [];
  let companies: { id: string; name: string }[] = [];
  let deals: {
    id: string;
    stage: string;
    title: string;
    value_estimate: number | null;
    currency: string;
    company_id: string | null;
    primary_contact_id: string | null;
  }[] = [];
  const contactsByCompany = new Map<string, DealContact[]>();

  if (ctx) {
    const [dealsRes, companiesRes, contactsRes, qualified] = await Promise.all([
      ctx.supabase
        .from("deals")
        .select("id, stage, title, value_estimate, currency, company_id, primary_contact_id")
        .eq("organization_id", ctx.orgId)
        .eq("origin", active)
        .order("created_at", { ascending: false }),
      ctx.supabase.from("companies").select("id, name").eq("organization_id", ctx.orgId).order("name").limit(2000),
      ctx.supabase
        .from("contacts")
        .select("id, full_name, company_id, temperature, origin, qualification_reason, qualified_at")
        .eq("organization_id", ctx.orgId)
        .not("company_id", "is", null)
        .limit(2000),
      loadQualifiedContactIds(ctx),
    ]);
    loadFailed = Boolean(dealsRes.error || companiesRes.error || contactsRes.error);
    people = contactsRes.data ?? [];
    deals = dealsRes.data ?? [];
    companies = (companiesRes.data ?? []).map((c) => ({ id: c.id, name: c.name }));
    for (const c of contactsRes.data ?? []) {
      const list = contactsByCompany.get(c.company_id) ?? [];
      list.push({ id: c.id, name: c.full_name, qualification: qualificationOf(c.temperature, Boolean(c.qualified_at) || qualified.has(c.id)), reason: c.qualification_reason, updatedAt: c.qualified_at });
      contactsByCompany.set(c.company_id, list);
    }
    for (const list of contactsByCompany.values()) list.sort((a, b) => rankOf(a.qualification) - rankOf(b.qualification));
  }

  const companyNames = new Map(companies.map((c) => [c.id, c.name]));

  const stagesWithDeals = stages.map((stage) => ({
    ...stage,
    deals: deals
      .filter((d) => d.stage === stage.key)
      .map(
        (d): PipelineDeal => ({
          id: d.id,
          title: d.title,
          value_estimate: d.value_estimate == null ? null : Number(d.value_estimate),
          currency: d.currency,
          company: d.company_id ? (companyNames.get(d.company_id) ?? null) : null,
          contacts: d.company_id && d.primary_contact_id ? (contactsByCompany.get(d.company_id) ?? []).filter(c => c.id === d.primary_contact_id) : [],
        }),
      ),
  }));

  return (
    <>
      <CrmRefresh />
      <PageHeader
        title="Pipeline"
        description="Cada oportunidad, su persona de contacto y la próxima etapa."
        action={ctx ? <NewDealForm origin={active} companies={companies} contacts={people} /> : undefined}
      />
      <div className="flex flex-col gap-5 p-5 sm:p-8">
        <OriginTabs active={active} />
        {loadFailed ? <p role="alert" className="text-sm text-danger">No se pudieron cargar las oportunidades. Recargá para reintentar.</p> : !ctx ? <p className="text-sm text-muted">Iniciá sesión para ver tu pipeline.</p> : <PipelineBoard stages={stagesWithDeals} interactive />}
        <p className="text-xs leading-relaxed text-muted-2">
          El semáforo se actualiza con interacciones registradas de la persona asociada. Mover una etapa no cambia su cualificación. Las respuestas de canales externos requieren una integración.
        </p>
      </div>
    </>
  );
}
