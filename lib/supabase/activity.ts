import type { getOrgContext } from "@/lib/supabase/org";

type OrgContext = NonNullable<Awaited<ReturnType<typeof getOrgContext>>>;

// Deja constancia en Actividad de algo que el equipo hizo de verdad. Alimenta el Medidor de KPIs.
// La acción principal ya se guardó: si el registro falla, no la deshacemos, pero queda en el log del servidor.
export async function logActivity(
  ctx: OrgContext,
  entry: { kind: string; body: string; contact_id?: string | null; company_id?: string | null; deal_id?: string | null },
) {
  const { error } = await ctx.supabase.from("activities").insert({
    organization_id: ctx.orgId,
    created_by: ctx.user.id,
    ...entry,
  });
  if (error) console.error("No se pudo registrar la actividad:", error.message);
}
