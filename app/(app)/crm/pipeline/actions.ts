"use server";

import { revalidatePath } from "next/cache";
import { getOrgContext } from "@/lib/supabase/org";

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

  const { error } = await ctx.supabase.from("deals").insert({
    organization_id: ctx.orgId,
    title,
    stage,
    origin,
    currency,
    value_estimate,
    owner_id: ctx.user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/crm/pipeline");
  return { error: null };
}
