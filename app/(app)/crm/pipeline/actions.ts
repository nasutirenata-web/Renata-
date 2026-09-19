"use server";

import { revalidatePath } from "next/cache";
import { getOrgContext } from "@/lib/supabase/org";
import { logActivity } from "@/lib/supabase/activity";

const STAGES = ["contacto", "interes", "reunion", "pedido", "cliente"];
const CURRENCIES = ["USD", "ARS"];

export async function createDeal(formData: FormData) {
  const ctx = await getOrgContext();
  if (!ctx) return { error: "No hay sesión activa u organización." };

  const title = String(formData.get("title") ?? "").trim();
  const stage = String(formData.get("stage") ?? "contacto");
  const origin = String(formData.get("origin") ?? "outbound");
  const currency = String(formData.get("currency") ?? "USD");
  const rawValue = String(formData.get("value") ?? "").trim();
  const companyId = String(formData.get("company_id") ?? "").trim() || null;

  const contactId = String(formData.get("contact_id") ?? "").trim() || null;
  if (title.length > 200) return { error: "El nombre es demasiado largo." };
  if (!companyId) return { error: "Seleccioná una empresa del CRM." };
  if (!title) return { error: "El nombre de la oportunidad es obligatorio." };
  if (!STAGES.includes(stage)) return { error: "Etapa inválida." };
  if (!["outbound", "inbound"].includes(origin)) return { error: "Origen inválido." };
  if (!CURRENCIES.includes(currency)) return { error: "Moneda inválida." };

  let value_estimate: number | null = null;
  if (rawValue) {
    value_estimate = Number(rawValue.replace(",", "."));
    if (!Number.isFinite(value_estimate) || value_estimate < 0) {
      return { error: "El monto tiene que ser un número positivo." };
    }
  }

  if (companyId) {
    const { data: company } = await ctx.supabase
      .from("companies")
      .select("id")
      .eq("organization_id", ctx.orgId)
      .eq("id", companyId)
      .maybeSingle();
    if (!company) return { error: "La empresa elegida no existe en tu organización." };
  }

  if (contactId) {
    const { data: contact } = await ctx.supabase.from("contacts").select("id,company_id").eq("organization_id",ctx.orgId).eq("id",contactId).maybeSingle();
    if (!contact || contact.company_id !== companyId) return { error: "La persona no pertenece a la empresa seleccionada." };
  }
  const { data, error } = await ctx.supabase
    .from("deals")
    .insert({
      organization_id: ctx.orgId,
      company_id: companyId,
      primary_contact_id: contactId,
      title,
      stage,
      origin,
      currency,
      value_estimate,
      owner_id: ctx.user.id,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "No se pudo guardar la oportunidad." };

  await logActivity(ctx, { kind: "oportunidad_creada", body: `Oportunidad creada: ${title}.`, deal_id: data.id, company_id: companyId, contact_id: contactId });

  revalidatePath("/crm/pipeline");
  revalidatePath("/crm/actividad");
  return { error: null };
}

export async function updateDealStage(dealId: string, stage: string) {
  if (!STAGES.includes(stage)) return { error: "Etapa inválida." };
  const ctx = await getOrgContext();
  if (!ctx) return { error: "Iniciá sesión para mover la oportunidad." };
  const { data: before } = await ctx.supabase.from("deals").select("title, stage, company_id, primary_contact_id").eq("organization_id",ctx.orgId).eq("id",dealId).maybeSingle();
  if (!before) return { error: "La oportunidad no está disponible." };
  if (before.stage === stage) return { error: null };
  const { data, error } = await ctx.supabase.from("deals").update({stage,updated_at:new Date().toISOString()}).eq("organization_id",ctx.orgId).eq("id",dealId).eq("stage",before.stage).select("id").maybeSingle();
  if (error || !data) return { error: "No se pudo cambiar la etapa. Recargá y reintentá." };
  const labels: Record<string,string> = {contacto:"Primer contacto",interes:"Interés",reunion:"Reunión",pedido:"Primer pedido",cliente:"Cliente activo"};
  await logActivity(ctx,{kind:"cambio_etapa",body:before.title + ": " + labels[before.stage] + " → " + labels[stage],deal_id:dealId,company_id:before.company_id,contact_id:before.primary_contact_id});
  revalidatePath("/crm/pipeline"); revalidatePath("/crm/actividad"); revalidatePath("/crm/contactos","layout"); revalidatePath("/dashboard");
  return {error:null};
}
