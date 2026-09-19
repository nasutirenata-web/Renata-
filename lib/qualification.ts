import type { getOrgContext } from "@/lib/supabase/org";
import type { Temperature } from "@/lib/qualification-rules";

export type { Temperature };

type OrgContext = NonNullable<Awaited<ReturnType<typeof getOrgContext>>>;

export const QUALIFICATION_KIND = "cualificacion_lead";

export const QUALIFICATION_LABELS: Record<Temperature, string> = {
  hot: "Caliente",
  warm: "Medio",
  cold: "Frío",
};

// En la base, "Frío" es el valor por defecto de todo contacto nuevo. Por eso un contacto en Frío solo
// cuenta como cualificado si alguien lo marcó de forma explícita (queda constancia en Actividad).
// Caliente y Medio siempre implican que alguien lo cualificó. Sin cualificar devuelve null, nunca "Frío".
export function qualificationOf(temperature: Temperature, markedExplicitly: boolean): Temperature | null {
  return temperature !== "cold" || markedExplicitly ? temperature : null;
}

export async function loadQualifiedContactIds(ctx: OrgContext): Promise<Set<string>> {
  const { data } = await ctx.supabase
    .from("activities")
    .select("contact_id")
    .eq("organization_id", ctx.orgId)
    .in("kind", [QUALIFICATION_KIND, "respuesta_interes", "reunion_confirmada", "propuesta_solicitada", "sin_interes", "fuera_icp", "baja_solicitada"])
    .not("contact_id", "is", null)
    .limit(5000);
  return new Set((data ?? []).map((row) => row.contact_id as string));
}
