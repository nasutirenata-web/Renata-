"use server";

import { revalidatePath } from "next/cache";
import { getOrgContext } from "@/lib/supabase/org";

export async function logSearch(criteria: string, resultCount: number) {
  const ctx = await getOrgContext();
  if (!ctx) return;

  await ctx.supabase.from("activities").insert({
    organization_id: ctx.orgId,
    kind: "busqueda_ia",
    body: `Búsqueda de prospectos (${criteria}) → ${resultCount} hipótesis generadas por IA.`,
    created_by: ctx.user.id,
  });

  revalidatePath("/prospeccion");
}

export async function addProspectToCrm(name: string, origin: "outbound" | "inbound" = "outbound") {
  const ctx = await getOrgContext();
  if (!ctx) return { error: "No hay sesión activa u organización." };

  const { error } = await ctx.supabase.from("companies").insert({
    organization_id: ctx.orgId,
    name,
    origin,
    notes: "Cargado desde Prospección (hipótesis sugerida por IA, sin verificar).",
    created_by: ctx.user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/crm/empresas");
  return { error: null };
}

export async function addHunterEmailToCrm(params: {
  fullName: string;
  email: string;
  roleTitle: string | null;
  organization: string | null;
}) {
  const ctx = await getOrgContext();
  if (!ctx) return { error: "No hay sesión activa u organización." };

  const { error } = await ctx.supabase.from("contacts").insert({
    organization_id: ctx.orgId,
    full_name: params.fullName || params.email,
    role_title: params.roleTitle,
    email: params.email,
    preferred_channel: "email",
    origin: "outbound",
    created_by: ctx.user.id,
  });

  if (error) return { error: error.message };

  await ctx.supabase.from("activities").insert({
    organization_id: ctx.orgId,
    kind: "hunter_email",
    body: `Email real de Hunter.io agregado: ${params.email}${params.organization ? ` (${params.organization})` : ""}.`,
    created_by: ctx.user.id,
  });

  revalidatePath("/crm/contactos");
  return { error: null };
}
