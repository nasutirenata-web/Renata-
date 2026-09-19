"use server";

import { revalidatePath } from "next/cache";
import { getOrgContext } from "@/lib/supabase/org";
import { logActivity } from "@/lib/supabase/activity";
import { loadCompanyIndex, normalizeName } from "@/lib/crm-dedupe";

export async function createCompany(formData: FormData) {
  const ctx = await getOrgContext();
  if (!ctx) return { error: "No hay sesión activa u organización." };

  const name = String(formData.get("name") ?? "").trim();
  const segment = String(formData.get("segment") ?? "").trim() || null;
  const origin = String(formData.get("origin") ?? "outbound");

  if (!name) return { error: "El nombre es obligatorio." };
  if (!["outbound", "inbound"].includes(origin)) return { error: "Origen inválido." };

  const existing = (await loadCompanyIndex(ctx)).get(normalizeName(name));
  if (existing) return { error: `Ya tenés una empresa con ese nombre: ${existing.name}.` };

  const { error } = await ctx.supabase.from("companies").insert({
    organization_id: ctx.orgId,
    name,
    segment,
    origin,
    created_by: ctx.user.id,
  });

  if (error) return { error: error.message };

  await logActivity(ctx, { kind: "empresa_creada", body: `Empresa agregada: ${name}.` });

  revalidatePath("/crm/empresas");
  revalidatePath("/crm/actividad");
  return { error: null };
}
