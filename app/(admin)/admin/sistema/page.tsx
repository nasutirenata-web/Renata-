import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function AdminSistemaPage() {
  const checks = [
    { name: "Supabase", ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) },
    { name: "Anthropic", ok: Boolean(process.env.ANTHROPIC_API_KEY) },
    { name: "LinkedIn OAuth", ok: Boolean(process.env.LINKEDIN_CLIENT_ID) },
  ];

  return (
    <>
      <PageHeader title="System health" description="Estado real de cada dependencia externa." />
      <div className="grid gap-4 p-8 sm:grid-cols-3">
        {checks.map((c) => (
          <Card key={c.name}>
            <CardTitle>{c.name}</CardTitle>
            <CardDescription className="mt-2">
              <Badge tone={c.ok ? "ok" : "danger"}>{c.ok ? "Configurado" : "Sin configurar"}</Badge>
            </CardDescription>
          </Card>
        ))}
      </div>
    </>
  );
}
