import { NextRequest, NextResponse } from "next/server";
import { getOrgContext } from "@/lib/supabase/org";

export async function GET(req: NextRequest) {
  const ctx = await getOrgContext();
  if (!ctx) return NextResponse.json({error:"Iniciá sesión para recuperar los borradores de tu organización."},{status:401});
  const key=req.nextUrl.searchParams.get("section");
  if (!key || key.length>200) return NextResponse.json({error:"Sección inválida."},{status:400});
  const {data,error}=await ctx.supabase.from("strategy_drafts").select("values,updated_at").eq("organization_id",ctx.orgId).eq("section_key",key).maybeSingle();
  if(error)return NextResponse.json({error:"No se pudo recuperar el borrador. Reintentá."},{status:500});
  return NextResponse.json({values:data?.values??{},updatedAt:data?.updated_at??null});
}
export async function POST(req:NextRequest) {
  const ctx=await getOrgContext();
  if(!ctx)return NextResponse.json({error:"Iniciá sesión para guardar en tu organización."},{status:401});
  const body=await req.json().catch(()=>null);
  if(!body||typeof body.section!=="string"||body.section.length>200||!body.values||typeof body.values!=="object"||Array.isArray(body.values)||JSON.stringify(body.values).length>50000||!Object.values(body.values).every(v=>typeof v==="string")) return NextResponse.json({error:"Borrador inválido o demasiado extenso."},{status:400});
  const {error}=await ctx.supabase.from("strategy_drafts").upsert({organization_id:ctx.orgId,section_key:body.section,values:body.values,updated_by:ctx.user.id,updated_at:new Date().toISOString()},{onConflict:"organization_id,section_key"});
  if(error)return NextResponse.json({error:"No se pudo guardar. Verificá tus permisos e intentá nuevamente."},{status:500});
  return NextResponse.json({saved:true});
}
