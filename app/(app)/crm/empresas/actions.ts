"use server";

import { revalidatePath } from "next/cache";
import { getOrgContext } from "@/lib/supabase/org";

export async function createCompany(formData: FormData) {
  const ctx = await getOrgContext();
  if (!ctx) return { error: "No hay sesión activa u organización." };

  const name = String(formData.get("name") ?? "").trim();
  const segment = String(formData.get("segment") ?? "").trim() || null;
  const origin = String(formData.get("origin") ?? "outbound");

  if (!name) return { error: "El nombre es obligatorio." };

  const { error } = await ctx.supabase.from("companies").insert({
    organization_id: ctx.orgId,
    name,
    segment,
    origin,
    created_by: ctx.user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/crm/empresas");
  return { error: null };
}
