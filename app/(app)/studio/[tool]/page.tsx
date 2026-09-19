import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app/PageHeader";
import { ToolRunner } from "@/components/studio/ToolRunner";
import { LeadScoringTool, type ScorableContact } from "@/components/studio/LeadScoringTool";
import { getSkillTool, skillTools } from "@/lib/skills-registry";
import { getOrgContext } from "@/lib/supabase/org";
import { loadQualifiedContactIds, qualificationOf } from "@/lib/qualification";
import Link from "next/link";

export function generateStaticParams() {
  return skillTools.map((tool) => ({ tool: tool.slug }));
}

export default async function StudioToolPage({
  params,
  searchParams,
}: {
  params: Promise<{ tool: string }>;
  searchParams: Promise<{ contacto?: string }>;
}) {
  const { tool: slug } = await params;
  const { contacto } = await searchParams;
  const tool = getSkillTool(slug);
  if (!tool) notFound();

  if (tool.slug === "scoring-leads") {
    const ctx = await getOrgContext();
    let contacts: ScorableContact[] = [];
    if (ctx) {
      // Las empresas se leen aparte: un contacto puede estar ligado a su empresa de dos maneras en la base
      // y pedir todo junto puede fallar por ambigüedad.
      const [contactsRes, companiesRes, qualified] = await Promise.all([
        ctx.supabase
          .from("contacts")
          .select("id, full_name, role_title, temperature, company_id")
          .eq("organization_id", ctx.orgId)
          .order("created_at", { ascending: false })
          .limit(1000),
        ctx.supabase.from("companies").select("id, name").eq("organization_id", ctx.orgId).limit(2000),
        loadQualifiedContactIds(ctx),
      ]);
      const companyNames = new Map((companiesRes.data ?? []).map((c) => [c.id, c.name]));
      contacts = (contactsRes.data ?? []).map((c) => ({
        id: c.id,
        full_name: c.full_name,
        role_title: c.role_title,
        temperature: qualificationOf(c.temperature, qualified.has(c.id)),
        company_name: c.company_id ? (companyNames.get(c.company_id) ?? null) : null,
      }));
    }
    return (
      <>
        <PageHeader title={tool.title} description={tool.description} />
        {contacto && (
          <div className="px-8 pt-4 text-xs">
            <Link href="/crm/pipeline" className="text-muted hover:text-brand">
              ← Volver al Pipeline
            </Link>
          </div>
        )}
        <LeadScoringTool contacts={contacts} connected={Boolean(ctx)} initialContactId={contacto} />
      </>
    );
  }

  let knownContacts: { full_name: string; role_title: string | null; email: string | null }[] = [];
  if (tool.fields.some((f) => f.type === "contact-name")) {
    const ctx = await getOrgContext();
    if (ctx) {
      const { data } = await ctx.supabase
        .from("contacts")
        .select("full_name, role_title, email")
        .eq("organization_id", ctx.orgId)
        .order("created_at", { ascending: false });
      knownContacts = data ?? [];
    }
  }

  return (
    <>
      <PageHeader title={tool.title} description={tool.description} />
      <ToolRunner tool={tool} knownContacts={knownContacts} />
    </>
  );
}
