import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app/PageHeader";
import { ToolRunner } from "@/components/studio/ToolRunner";
import { LeadScoringTool, type ScorableContact } from "@/components/studio/LeadScoringTool";
import { getSkillTool, skillTools } from "@/lib/skills-registry";
import { getOrgContext } from "@/lib/supabase/org";

export function generateStaticParams() {
  return skillTools.map((tool) => ({ tool: tool.slug }));
}

export default async function StudioToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool: slug } = await params;
  const tool = getSkillTool(slug);
  if (!tool) notFound();

  if (tool.slug === "scoring-leads") {
    const ctx = await getOrgContext();
    let contacts: ScorableContact[] = [];
    if (ctx) {
      const { data } = await ctx.supabase
        .from("contacts")
        .select("id, full_name, role_title, temperature, companies(name)")
        .eq("organization_id", ctx.orgId)
        .order("created_at", { ascending: false });
      contacts = (data ?? []).map((c) => ({
        id: c.id,
        full_name: c.full_name,
        role_title: c.role_title,
        temperature: c.temperature,
        company_name: (c.companies as unknown as { name: string } | null)?.name ?? null,
      }));
    }
    return (
      <>
        <PageHeader title={tool.title} description={tool.description} />
        <LeadScoringTool contacts={contacts} connected={Boolean(ctx)} />
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
