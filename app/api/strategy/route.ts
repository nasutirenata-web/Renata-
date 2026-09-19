import { NextRequest, NextResponse } from "next/server";
import { getOrgContext } from "@/lib/supabase/org";
import { logActivity } from "@/lib/supabase/activity";
import { allSteps } from "@/lib/strategy-steps";
import { WORKSPACE_KEY, RESEARCH_KEY } from "@/lib/strategy-workspace";
export async function GET(req: NextRequest) {
 const ctx=await getOrgContext();if(!ctx)return NextResponse.json({error:"Iniciá sesión para recuperar tu estrategia."},{status:401});
 const key=req.nextUrl.searchParams.get("section");
 const {data,error}=await ctx.supabase.from("strategy_drafts").select("section_key,values,updated_at").eq("organization_id",ctx.orgId);
 if(error)return NextResponse.json({error:"No se pudo recuperar la estrategia. Reintentá."},{status:500});
 if(key){const row=data?.find(d=>d.section_key===key);return NextResponse.json({values:row?.values??{},updatedAt:row?.updated_at??null});}
 const org=await ctx.supabase.from("organizations").select("name").eq("id",ctx.orgId).maybeSingle();
 const company=typeof ctx.user.user_metadata?.company==="string"?ctx.user.user_metadata.company:org.data?.name??"";
 return NextResponse.json({sections:Object.fromEntries((data??[]).map(d=>[d.section_key,{values:d.values,updatedAt:d.updated_at}])),company});
}
export async function POST(req:NextRequest){
 const ctx=await getOrgContext();if(!ctx)return NextResponse.json({error:"Iniciá sesión para guardar tu estrategia."},{status:401});
 const body=await req.json().catch(()=>null);
 const entries=Array.isArray(body?.entries)?body.entries:body?[{section:body.section,values:body.values}]:[];
 const allowed=new Set([...allSteps.map(s=>s.key),WORKSPACE_KEY,RESEARCH_KEY]);
 if(!entries.length||entries.length>20||entries.some((e: {section?:unknown;values?:unknown})=>typeof e?.section!=="string"||!allowed.has(e.section)||!e.values||typeof e.values!=="object"||Array.isArray(e.values)||JSON.stringify(e.values).length>100000||!Object.values(e.values).every(v=>typeof v==="string")))return NextResponse.json({error:"La información no tiene un formato válido."},{status:400});
 const {error}=await ctx.supabase.from("strategy_drafts").upsert(entries.map((e:{section:string;values:Record<string,string>})=>({organization_id:ctx.orgId,section_key:e.section,values:e.values,updated_by:ctx.user.id,updated_at:new Date().toISOString()})),{onConflict:"organization_id,section_key"});
 if(error)return NextResponse.json({error:"No se pudo guardar. Tus cambios siguen en pantalla; reintentá."},{status:500});
 const reviewed=entries.filter((e:{section:string})=>!e.section.startsWith("workspace:"));
 if(reviewed.length)await logActivity(ctx,{kind:"estrategia_guardada",body:"Estrategia actualizada: "+reviewed.map((e:{section:string})=>allSteps.find(s=>s.key===e.section)?.section.title).join(", ")+"."});
 return NextResponse.json({saved:true});
}
