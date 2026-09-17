"use server";

import { revalidatePath } from "next/cache";
import { getOrgContext } from "@/lib/supabase/org";

export async function createContact(formData: FormData) {
  const ctx = await getOrgContext();
  if (!ctx) return { error: "No hay sesión activa u organización." };

  const full_name = String(formData.get("full_name") ?? "").trim();
  const role_title = String(formData.get("role_title") ?? "").trim() || null;
  const origin = String(formData.get("origin") ?? "outbound");

  if (!full_name) return { error: "El nombre es obligatorio." };

  const { error } = await ctx.supabase.from("contacts").insert({
    organization_id: ctx.orgId,
    full_name,
    role_title,
    origin,
    created_by: ctx.user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/crm/contactos");
  return { error: null };
}

export async function setTemperature(contactId: string, temperature: "cold" | "warm" | "hot") {
  const ctx = await getOrgContext();
  if (!ctx) return { error: "No hay sesión activa u organización." };

  if (!["hot","warm","cold"].includes(temperature)) return { error: "Cualificación inválida." };
  const { data, error } = await ctx.supabase
    .from("contacts")
    .update({ temperature })
    .eq("id", contactId)
    .eq("organization_id", ctx.orgId).select("id").maybeSingle();

  if (!data && !error) return { error: "No se pudo guardar: el contacto no está disponible o no tenés permiso." };
  revalidatePath("/studio/scoring-leads");
  if (error) return { error: error.message };

  revalidatePath("/crm/contactos");
  return { error: null };
}
