import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProspectSearch } from "@/components/prospeccion/ProspectSearch";
import { getOrgContext } from "@/lib/supabase/org";
import { formatDateTime } from "@/lib/utils";
import { ClipboardList } from "lucide-react";

const fuentes = [
  { name: "Apollo", desc: "Base de contactos y empresas B2B, búsqueda por filtros." },
  { name: "Clay", desc: "Enriquecimiento y orquestación de datos entre proveedores." },
  { name: "Lusha", desc: "Datos de contacto verificados (email, teléfono)." },
  { name: "Hunter", desc: "Búsqueda y verificación de emails corporativos." },
  { name: "Prospeo", desc: "Emails y teléfonos a partir de LinkedIn." },
  { name: "People Data Labs", desc: "Enriquecimiento masivo de personas y empresas." },
  { name: "Dropcontact", desc: "Limpieza y enriquecimiento de contactos." },
];

export default async function ProspeccionPage() {
  const ctx = await getOrgContext();

  const activities = ctx
    ? (
        await ctx.supabase
          .from("activities")
          .select("id, kind, body, created_at")
          .eq("organization_id", ctx.orgId)
          .eq("kind", "busqueda_ia")
          .order("created_at", { ascending: false })
          .limit(10)
      ).data ?? []
    : [];

  return (
    <>
      <PageHeader
        title="Prospección"
        description="Buscá comercios nuevos para arrancar el outbound, o cargalos a mano."
      />
      <div className="flex flex-col gap-8 p-8">
        <ProspectSearch />

        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-2">
            Resultado de cada proceso terminado
          </p>
          {!ctx || activities.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Sin búsquedas registradas todavía"
              body="Cada búsqueda completada va a quedar registrada acá con su resultado."
            />
          ) : (
            <div className="flex flex-col gap-2">
              {activities.map((a) => (
                <Card key={a.id} className="flex items-center justify-between gap-4 py-3">
                  <p className="text-sm text-foreground/90">{a.body}</p>
                  <span className="shrink-0 text-xs text-muted-2">
                    {formatDateTime(a.created_at)}
                  </span>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-2">
            Fuentes de datos
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fuentes.map((f) => (
              <Card key={f.name} className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">{f.name}</CardTitle>
                  <CardDescription className="mt-1">{f.desc}</CardDescription>
                </div>
                <Badge tone="warning" className="shrink-0">
                  Sin conectar
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
