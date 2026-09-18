import { PageHeader, OriginTabs } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { NewCompanyForm } from "@/components/crm/NewCompanyForm";
import { CompaniesBoard } from "@/components/crm/CompaniesBoard";
import { getOrgContext } from "@/lib/supabase/org";
import { Building2 } from "lucide-react";

export default async function EmpresasPage({
  searchParams,
}: {
  searchParams: Promise<{ origen?: string }>;
}) {
  const { origen } = await searchParams;
  const active = origen === "inbound" ? "inbound" : "outbound";

  const ctx = await getOrgContext();
  const companies = ctx
    ? (
        await ctx.supabase
          .from("companies")
          .select("id, name, segment, origin, created_at")
          .eq("organization_id", ctx.orgId)
          .eq("origin", active)
          .order("created_at", { ascending: false })
      ).data ?? []
    : [];

  return (
    <>
      <PageHeader
        title="Empresas"
        description="Farmacias, comercios y cuentas B2B segmentadas por origen."
        action={<NewCompanyForm origin={active} />}
      />
      <div className="flex flex-col gap-6 p-8">
        <OriginTabs active={active} />

        {!ctx && (
          <EmptyState
            icon={Building2}
            title="Conectá Supabase para guardar empresas reales"
            body="Sin Supabase, esta lista queda vacía a propósito: no mostramos datos falsos. Configurá la conexión en Configuración → Integraciones."
          />
        )}

        {ctx && companies.length === 0 && (
          <EmptyState
            icon={Building2}
            title={`Todavía no hay empresas de ${active === "outbound" ? "Outbound" : "Inbound"}`}
            body="Usá 'Nueva empresa' arriba para cargar la primera cuenta."
          />
        )}

        {ctx && companies.length > 0 && <CompaniesBoard companies={companies} />}
      </div>
    </>
  );
}
