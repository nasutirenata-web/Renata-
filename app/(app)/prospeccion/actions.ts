"use server";

import { revalidatePath } from "next/cache";
import { getOrgContext } from "@/lib/supabase/org";
import { logActivity } from "@/lib/supabase/activity";
import { EMAIL_PATTERN, loadCompanyIndex, loadContactEmailIndex, normalizeName } from "@/lib/crm-dedupe";

const MAX_BATCH = 50;

export type SaveResult = {
  error: string | null;
  // Lo que se guardó de verdad (lo devuelve la base, no se supone) y lo que ya estaba en el CRM.
  saved: string[];
  duplicates: string[];
};

const failure = (error: string): SaveResult => ({ error, saved: [], duplicates: [] });

export async function logSearch(criteria: string, resultCount: number) {
  const ctx = await getOrgContext();
  if (!ctx) return;

  await ctx.supabase.from("activities").insert({
    organization_id: ctx.orgId,
    kind: "busqueda_ia",
    body: `Sugerencias de IA sin verificar: ${resultCount} empresas para «${criteria}».`,
    created_by: ctx.user.id,
  });

  revalidatePath("/prospeccion");
  revalidatePath("/crm/actividad");
}

// Empresas sugeridas por IA: se guardan como cuentas marcadas "sin verificar", sin duplicar las que ya existen.
export async function saveProspectCompanies(names: string[], origin: "outbound" | "inbound" = "outbound"): Promise<SaveResult> {
  const ctx = await getOrgContext();
  if (!ctx) return failure("No hay sesión activa u organización.");
  if (!["outbound", "inbound"].includes(origin)) return failure("Origen inválido.");

  const unique = new Map<string, string>();
  for (const raw of Array.isArray(names) ? names : []) {
    const name = String(raw ?? "").trim();
    if (name && name.length <= 120 && !unique.has(normalizeName(name))) unique.set(normalizeName(name), name);
  }
  if (unique.size === 0) return failure("Elegí al menos una empresa.");
  if (unique.size > MAX_BATCH) return failure(`Podés guardar hasta ${MAX_BATCH} empresas por vez.`);

  const existing = await loadCompanyIndex(ctx);
  const duplicates: string[] = [];
  const toInsert: { organization_id: string; name: string; origin: string; notes: string; created_by: string }[] = [];
  for (const [key, name] of unique) {
    const found = existing.get(key);
    if (found) duplicates.push(found.name);
    else
      toInsert.push({
        organization_id: ctx.orgId,
        name,
        origin,
        notes: "Sugerida por IA, sin verificar. Confirmá que existe y que encaja antes de contactarla.",
        created_by: ctx.user.id,
      });
  }

  let saved: string[] = [];
  if (toInsert.length > 0) {
    const { data, error } = await ctx.supabase.from("companies").insert(toInsert).select("name");
    if (error) return failure(error.message);
    saved = (data ?? []).map((row) => row.name as string);
    if (saved.length > 0) {
      await logActivity(ctx, {
        kind: "empresa_creada",
        body: `${saved.length === 1 ? "Empresa agregada" : `${saved.length} empresas agregadas`} desde Prospección (sugerencias de IA sin verificar).`,
      });
    }
  }

  revalidatePath("/crm/empresas");
  revalidatePath("/crm/actividad");
  return { error: null, saved, duplicates };
}

// Personas encontradas por Hunter: se asocian a su empresa (se crea solo si no existe) y no se duplican por email.
export async function saveHunterContacts(params: {
  organization: string | null;
  people: { fullName: string; email: string; roleTitle: string | null }[];
}): Promise<SaveResult> {
  const ctx = await getOrgContext();
  if (!ctx) return failure("No hay sesión activa u organización.");

  const people = new Map<string, { fullName: string; email: string; roleTitle: string | null }>();
  for (const p of Array.isArray(params?.people) ? params.people : []) {
    const email = String(p?.email ?? "").trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email) || email.length > 200 || people.has(email)) continue;
    people.set(email, {
      email,
      fullName: String(p?.fullName ?? "").trim().slice(0, 120) || email,
      roleTitle: String(p?.roleTitle ?? "").trim().slice(0, 120) || null,
    });
  }
  if (people.size === 0) return failure("Elegí al menos una persona con un email válido.");
  if (people.size > MAX_BATCH) return failure(`Podés guardar hasta ${MAX_BATCH} personas por vez.`);

  const emailIndex = await loadContactEmailIndex(ctx);
  const duplicates: string[] = [];
  const fresh = [...people.values()].filter((p) => {
    const found = emailIndex.get(p.email);
    if (found) duplicates.push(`${found.full_name} (${p.email})`);
    return !found;
  });

  let saved: string[] = [];
  if (fresh.length > 0) {
    // La empresa se reutiliza si ya existe con ese nombre; si no, se crea marcada como cargada desde Hunter.
    let companyId: string | null = null;
    const organization = String(params?.organization ?? "").trim().slice(0, 120);
    if (organization) {
      const companies = await loadCompanyIndex(ctx);
      const known = companies.get(normalizeName(organization));
      if (known) companyId = known.id;
      else {
        const { data: created } = await ctx.supabase
          .from("companies")
          .insert({ organization_id: ctx.orgId, name: organization, origin: "outbound", notes: "Cargada desde una búsqueda en Hunter.io.", created_by: ctx.user.id })
          .select("id")
          .single();
        companyId = created?.id ?? null;
      }
    }

    const { data, error } = await ctx.supabase
      .from("contacts")
      .insert(
        fresh.map((p) => ({
          organization_id: ctx.orgId,
          company_id: companyId,
          full_name: p.fullName,
          role_title: p.roleTitle,
          email: p.email,
          preferred_channel: "email",
          origin: "outbound",
          created_by: ctx.user.id,
        })),
      )
      .select("id, full_name, email");
    if (error) return failure(error.message);

    saved = (data ?? []).map((row) => `${row.full_name}`);
    if ((data ?? []).length > 0) {
      await ctx.supabase.from("activities").insert(
        (data ?? []).map((row) => ({
          organization_id: ctx.orgId,
          kind: "hunter_email",
          body: `Contacto agregado desde Hunter.io: ${row.full_name}${organization ? ` (${organization})` : ""}.`,
          contact_id: row.id,
          company_id: companyId,
          created_by: ctx.user.id,
        })),
      );
    }
  }

  revalidatePath("/crm/contactos", "layout");
  revalidatePath("/crm/empresas");
  revalidatePath("/crm/actividad");
  return { error: null, saved, duplicates };
}
