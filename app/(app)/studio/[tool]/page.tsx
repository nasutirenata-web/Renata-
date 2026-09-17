import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app/PageHeader";
import { ToolRunner } from "@/components/studio/ToolRunner";
import { getSkillTool, skillTools } from "@/lib/skills-registry";

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

  return (
    <>
      <PageHeader title={tool.title} description={tool.description} />
      <ToolRunner tool={tool} />
    </>
  );
}
