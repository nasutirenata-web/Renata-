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

export async function addProspectToCrm(name: string) {
  const ctx = await getOrgContext();
  if (!ctx) return { error: "No hay sesión activa u organización." };

  const { error } = await ctx.supabase.from("companies").insert({
    organization_id: ctx.orgId,
    name,
    origin: "outbound",
    notes: "Cargado desde Prospección (hipótesis sugerida por IA, sin verificar).",
    created_by: ctx.user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/crm/empresas");
  return { error: null };
}
