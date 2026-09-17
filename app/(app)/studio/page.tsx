import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { skillTools, type SkillTool } from "@/lib/skills-registry";
import { ImageIcon, ArrowRight, CalendarDays } from "lucide-react";

function ToolCard({ tool }: { tool: SkillTool }) {
  return (
    <Link href={`/studio/${tool.slug}`}>
      <Card className="flex h-full flex-col transition-colors hover:border-lime/40">
        <Badge tone="neutral" className="w-fit normal-case">
          {tool.module}
        </Badge>
        <CardTitle className="mt-4">{tool.title}</CardTitle>
        <CardDescription className="mt-2 flex-1">{tool.description}</CardDescription>
        <span className="mt-4 inline-flex items-center gap-1 text-sm text-lime">
          Abrir <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Card>
    </Link>
  );
}

export default function StudioPage() {
  const outboundTools = skillTools.filter((t) => t.funnel === "outbound" || t.funnel === "ambos");
  const inboundTools = skillTools.filter((t) => t.funnel === "inbound" || t.funnel === "ambos");

  return (
    <>
      <PageHeader
        title="Studio"
        description="Las 12 herramientas comerciales del equipo, organizadas por Outbound e Inbound."
      />
      <div className="flex flex-col gap-10 p-8">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime">Outbound</p>
            <span className="text-xs text-muted-2">Prospección y captación</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outboundTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime">Inbound</p>
            <span className="text-xs text-muted-2">Contenido y demanda entrante</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/studio/diseno">
              <Card className="h-full border-lime/25 transition-colors hover:border-lime/50">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2 text-lime">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <Badge tone="lime">Diseño</Badge>
                </div>
                <CardTitle className="mt-4">Diseño de imágenes</CardTitle>
                <CardDescription className="mt-2">
                  Generá con IA imágenes on-brand para publicaciones.
                </CardDescription>
              </Card>
            </Link>
            <Link href="/studio/calendario">
              <Card className="h-full transition-colors hover:border-lime/40">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2 text-lime">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <Badge tone="neutral">Calendario</Badge>
                </div>
                <CardTitle className="mt-4">Calendario editorial</CardTitle>
                <CardDescription className="mt-2">
                  Contenido planificado, compartido con Social.
                </CardDescription>
              </Card>
            </Link>
            {inboundTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
