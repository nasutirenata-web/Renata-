"use server";

import { revalidatePath } from "next/cache";
import { getOrgContext } from "@/lib/supabase/org";
import { logActivity } from "@/lib/supabase/activity";
import { EMAIL_PATTERN, loadContactEmailIndex } from "@/lib/crm-dedupe";
import { QUALIFICATION_KIND, QUALIFICATION_LABELS } from "@/lib/qualification";

function refreshCrm() {
  revalidatePath("/crm/contactos", "layout");
  revalidatePath("/crm/pipeline");
  revalidatePath("/crm/actividad");
}

export async function createContact(formData: FormData) {
  const ctx = await getOrgContext();
  if (!ctx) return { error: "No hay sesión activa u organización." };

  const full_name = String(formData.get("full_name") ?? "").trim();
  const role_title = String(formData.get("role_title") ?? "").trim() || null;
  const origin = String(formData.get("origin") ?? "outbound");
  const companyId = String(formData.get("company_id") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim().toLowerCase() || null;

  if (!full_name) return { error: "El nombre es obligatorio." };
  if (full_name.length > 120) return { error: "El nombre puede tener hasta 120 caracteres." };
  if (!["outbound", "inbound"].includes(origin)) return { error: "Origen inválido." };
  if (email && !EMAIL_PATTERN.test(email)) return { error: "El email no es válido." };

  if (companyId) {
    const { data: company } = await ctx.supabase
      .from("companies")
      .select("id")
      .eq("organization_id", ctx.orgId)
      .eq("id", companyId)
      .maybeSingle();
    if (!company) return { error: "La empresa elegida no existe en tu organización." };
  }

  if (email) {
    const existing = (await loadContactEmailIndex(ctx)).get(email);
    if (existing) return { error: `Ya tenés un contacto con ese email: ${existing.full_name}.` };
  }

  const { data, error } = await ctx.supabase
    .from("contacts")
    .insert({
      organization_id: ctx.orgId,
      full_name,
      role_title,
      email,
      company_id: companyId,
      origin,
      created_by: ctx.user.id,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "No se pudo guardar el contacto." };

  await logActivity(ctx, {
    kind: "contacto_creado",
    body: `Contacto agregado: ${full_name}.`,
    contact_id: data.id,
    company_id: companyId,
  });

  refreshCrm();
  return { error: null };
}

export async function setTemperature(contactId: string, temperature: "cold" | "warm" | "hot") {
  const ctx = await getOrgContext();
  if (!ctx) return { error: "No hay sesión activa u organización." };

  if (!["hot", "warm", "cold"].includes(temperature)) return { error: "Cualificación inválida." };
  const { data, error } = await ctx.supabase
    .from("contacts")
    .update({ temperature, qualified_at: new Date().toISOString(), qualification_source: "manual", qualification_reason: "Cualificación revisada manualmente por el equipo." })
    .eq("id", contactId)
    .eq("organization_id", ctx.orgId)
    .select("id")
    .maybeSingle();

  if (error) return { error: error.message };
  if (!data) return { error: "No se pudo guardar: el contacto no está disponible o no tenés permiso." };

  // La constancia es lo que distingue "cualificado como Frío" de "sin cualificar".
  await logActivity(ctx, {
    kind: QUALIFICATION_KIND,
    body: `Cualificación de un lead actualizada a ${QUALIFICATION_LABELS[temperature]}.`,
    contact_id: contactId,
  });

  revalidatePath("/studio/scoring-leads");
  refreshCrm();
  return { error: null };
}

export async function recordContactSignal(contactId: string, signal: string) {
  const { SIGNALS, isSignalKind } = await import("@/lib/qualification-rules");
  const ctx = await getOrgContext();
  if (!ctx) return { error: "Iniciá sesión para registrar esta interacción." };
  if (!isSignalKind(signal)) return { error: "Elegí una interacción válida." };
  const { data: contact, error: readError } = await ctx.supabase.from("contacts").select("id, company_id").eq("organization_id", ctx.orgId).eq("id", contactId).maybeSingle();
  if (readError || !contact) return { error: "El contacto no está disponible." };
  const { error } = await ctx.supabase.from("activities").insert({ organization_id: ctx.orgId, contact_id: contact.id, company_id: contact.company_id, kind: signal, body: SIGNALS[signal].reason + " Registrado por el equipo.", created_by: ctx.user.id });
  if (error) return { error: "No se pudo registrar la interacción. Intentá nuevamente." };
  refreshCrm();
  revalidatePath("/dashboard");
  return { error: null };
}
