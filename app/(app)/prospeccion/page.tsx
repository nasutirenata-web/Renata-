import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search, Plus, Sparkles } from "lucide-react";

const fuentes = [
  { name: "Apollo", desc: "Base de contactos y empresas B2B, búsqueda por filtros." },
  { name: "Clay", desc: "Enriquecimiento y orquestación de datos entre proveedores." },
  { name: "Lusha", desc: "Datos de contacto verificados (email, teléfono)." },
  { name: "Hunter", desc: "Búsqueda y verificación de emails corporativos." },
  { name: "Prospeo", desc: "Emails y teléfonos a partir de LinkedIn." },
  { name: "People Data Labs", desc: "Enriquecimiento masivo de personas y empresas." },
  { name: "Dropcontact", desc: "Limpieza y enriquecimiento de contactos." },
];

export default function ProspeccionPage() {
  return (
    <>
      <PageHeader
        title="Prospección"
        description="Buscá farmacias y comercios nuevos, o cargalos a mano para arrancar el outbound."
        action={
          <Button size="sm">
            <Plus className="h-4 w-4" /> Cargar prospecto manual
          </Button>
        }
      />
      <div className="flex flex-col gap-8 p-8">
        <Card className="flex flex-col gap-4">
          <CardTitle>Buscar prospectos</CardTitle>
          <CardDescription>
            Definí el criterio de búsqueda. Sin un proveedor de datos conectado, esto
            genera una lista sugerida por IA para investigar manualmente — no un
            resultado verificado.
          </CardDescription>
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              placeholder="Segmento (ej: farmacia de barrio)"
              className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
            />
            <input
              placeholder="Zona / ciudad"
              className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
            />
            <input
              placeholder="Tamaño estimado"
              className="rounded-xl border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-lime"
            />
          </div>
          <Button size="sm" className="w-fit">
            <Search className="h-4 w-4" /> Buscar
          </Button>
        </Card>

        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-2">
            Resultados
          </p>
          <EmptyState
            icon={Sparkles}
            title="Todavía no hay resultados"
            body="Conectá un proveedor de datos abajo, o generá una lista de hipótesis con IA desde Studio → Cualificación y scoring de leads."
            action={
              <LinkButton href="/studio/scoring-leads" variant="secondary" size="sm">
                Ir a scoring de leads
              </LinkButton>
            }
          />
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
