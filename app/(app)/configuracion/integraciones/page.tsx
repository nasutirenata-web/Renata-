import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Database, Bot, Share2, Plug, Mail } from "lucide-react";
import { isHunterConfigured } from "@/lib/integrations/hunter";

function statusBadge(connected: boolean) {
  return (
    <Badge tone={connected ? "ok" : "warning"}>
      {connected ? "Conectado" : "Pendiente de configurar"}
    </Badge>
  );
}

export default function IntegracionesPage() {
  const supabaseConnected = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const geminiConnected = Boolean(process.env.GEMINI_API_KEY);
  const linkedinConnected = Boolean(
    process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET,
  );
  const hunterConnected = isHunterConfigured();

  return (
    <>
      <PageHeader
        title="Integraciones"
        description="Estado real de cada conexión. Nada se marca conectado si no lo está de verdad."
      />
      <div className="flex flex-col gap-4 p-8">
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2 text-brand">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Supabase</CardTitle>
              <CardDescription className="mt-1 max-w-md">
                Base de datos, autenticación y almacenamiento. Sin esto, el CRM y el
                Studio no persisten información entre sesiones.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {statusBadge(supabaseConnected)}
            {!supabaseConnected && (
              <span className="text-xs text-muted-2">Ver README del proyecto</span>
            )}
          </div>
        </Card>

        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2 text-brand">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>IA (Gemini · Nano Banana)</CardTitle>
              <CardDescription className="mt-1 max-w-md">
                Motor de generación para el Studio, el Chat y el diseño de imágenes.
                Requiere una GEMINI_API_KEY configurada en el servidor.
              </CardDescription>
            </div>
          </div>
          {statusBadge(geminiConnected)}
        </Card>

        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2 text-brand">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>LinkedIn</CardTitle>
              <CardDescription className="mt-1 max-w-md">
                Conexión OAuth para publicar y gestionar mensajes desde Social →
                LinkedIn. Requiere una app propia en LinkedIn Developers.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {statusBadge(linkedinConnected)}
            <LinkButton
              href="/api/integrations/linkedin/connect"
              variant={linkedinConnected ? "secondary" : "primary"}
              size="sm"
            >
              {linkedinConnected ? "Reconectar" : "Conectar LinkedIn"}
            </LinkButton>
          </div>
        </Card>

        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2 text-brand">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Hunter.io</CardTitle>
              <CardDescription className="mt-1 max-w-md">
                Búsqueda de emails corporativos reales por dominio, en Prospección.
                Gratis hasta 25 búsquedas/mes, sin tarjeta. Conseguí tu key en{" "}
                <span className="text-brand">hunter.io/api-keys</span> y cargala como
                HUNTER_API_KEY en las variables de entorno.
              </CardDescription>
            </div>
          </div>
          {statusBadge(hunterConnected)}
        </Card>

        <Card className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2 text-brand">
              <Plug className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>APIs y MCPs propios</CardTitle>
              <CardDescription className="mt-1 max-w-md">
                Registrá proveedores de datos (Clay, Apollo, Lusha…) o servidores MCP
                propios. Se guardan en el servidor, nunca en el navegador.
              </CardDescription>
            </div>
          </div>
          <div className="rounded-2xl border border-dashed border-surface-border p-6 text-center text-sm text-muted">
            Esta sección queda lista en cuanto conectes Supabase: las credenciales se
            guardan del lado del servidor, ligadas a tu organización.
          </div>
        </Card>
      </div>
    </>
  );
}
