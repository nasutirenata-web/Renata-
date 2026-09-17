import { NextResponse } from "next/server";
import { getOrgContext } from "@/lib/supabase/org";

export async function requireAIUser() {
  const ctx = await getOrgContext();
  return ctx ? null : NextResponse.json({error:"auth_required",message:"Iniciá sesión para utilizar las herramientas de IA."},{status:401});
}
