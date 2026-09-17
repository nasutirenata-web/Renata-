import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { skillTools } from "@/lib/skills-registry";
import { ImageIcon, ArrowRight, CalendarDays } from "lucide-react";

export default function StudioPage() {
  return (
    <>
      <PageHeader
        title="Studio"
        description="Las 12 herramientas comerciales del equipo, listas para generar con IA y guardar en el CRM."
      />
      <div className="flex flex-col gap-8 p-8">
        <div className="grid gap-4 sm:grid-cols-2">
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
                Componé imágenes on-brand para publicaciones: post, carrusel o anuncio.
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
                Contenido planificado, compartido entre Studio y Social.
              </CardDescription>
            </Card>
          </Link>
        </div>

        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-2">
            Herramientas comerciales
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skillTools.map((tool) => (
              <Link key={tool.slug} href={`/studio/${tool.slug}`}>
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
