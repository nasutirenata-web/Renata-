import type { getOrgContext } from "@/lib/supabase/org";

type OrgContext = NonNullable<Awaited<ReturnType<typeof getOrgContext>>>;

// Compara nombres sin importar mayúsculas ni tildes: "Ágora Digital" y "agora digital" son la misma empresa.
export const normalizeName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ");

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function loadCompanyIndex(ctx: OrgContext) {
  const { data } = await ctx.supabase.from("companies").select("id, name").eq("organization_id", ctx.orgId).limit(5000);
  const index = new Map<string, { id: string; name: string }>();
  for (const company of data ?? []) index.set(normalizeName(company.name), { id: company.id, name: company.name });
  return index;
}

export async function loadContactEmailIndex(ctx: OrgContext) {
  const { data } = await ctx.supabase
    .from("contacts")
    .select("id, full_name, email")
    .eq("organization_id", ctx.orgId)
    .not("email", "is", null)
    .limit(5000);
  const index = new Map<string, { id: string; full_name: string }>();
  for (const contact of data ?? []) {
    if (contact.email) index.set(String(contact.email).trim().toLowerCase(), { id: contact.id, full_name: contact.full_name });
  }
  return index;
}
