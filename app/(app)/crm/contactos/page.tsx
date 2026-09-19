import { CrmRefresh } from "@/components/crm/CrmRefresh";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { ContactsBoard, type BoardContact } from "@/components/crm/ContactsBoard";
import { getOrgContext } from "@/lib/supabase/org";
import { loadQualifiedContactIds, qualificationOf } from "@/lib/qualification";

export default async function ContactosPage() {
  const ctx = await getOrgContext();

  let loadFailed = false;
  let contacts: BoardContact[] = [];
  let companies: { id: string; name: string }[] = [];

  if (ctx) {
    const [contactsRes, companiesRes, qualified] = await Promise.all([
      ctx.supabase
        .from("contacts")
        .select("id, full_name, role_title, email, temperature, origin, company_id, qualification_reason, qualified_at")
        .eq("organization_id", ctx.orgId)
        .order("created_at", { ascending: false })
        .limit(1000),
      ctx.supabase.from("companies").select("id, name").eq("organization_id", ctx.orgId).order("name").limit(2000),
      loadQualifiedContactIds(ctx),
    ]);
    loadFailed = Boolean(contactsRes.error || companiesRes.error);
    companies = (companiesRes.data ?? []).map((c) => ({ id: c.id, name: c.name }));
    const names = new Map(companies.map((c) => [c.id, c.name]));
    contacts = (contactsRes.data ?? []).map((c) => ({
      id: c.id,
      full_name: c.full_name,
      role_title: c.role_title,
      email: c.email,
      company: c.company_id ? (names.get(c.company_id) ?? null) : null,
      origin: c.origin === "inbound" ? "inbound" : "outbound",
      qualification: qualificationOf(c.temperature, Boolean(c.qualified_at) || qualified.has(c.id)),
      qualificationReason: c.qualification_reason, qualifiedAt: c.qualified_at,
    }));
  }

  return (
    <>
      <CrmRefresh />
      <PageHeader
        title="Contactos"
        description="Las personas de tus cuentas: empresa, cargo, origen y estado de cualificación."
        action={
          contacts.length > 0 ? (
            <LinkButton href="/prospeccion" size="sm">
              <Search className="h-4 w-4" /> Buscar prospectos
            </LinkButton>
          ) : undefined
        }
      />
      <div className="p-5 sm:p-8">
        {loadFailed ? <p role="alert" className="text-sm text-danger">No se pudieron cargar los contactos. Recargá para reintentar.</p> : ctx ? (
          <ContactsBoard contacts={contacts} companies={companies} />
        ) : (
          <p className="glass-panel rounded-2xl px-5 py-4 text-sm text-muted">
            Iniciá sesión (o conectá Supabase) para ver tus contactos. Sin sesión la lista queda vacía a propósito, en vez de mostrar datos falsos.
          </p>
        )}
      </div>
    </>
  );
}
