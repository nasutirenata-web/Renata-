import { StrategyWizard } from "@/components/app/StrategyWizard";
import { getOrgContext } from "@/lib/supabase/org";
export default async function Page(){
 const ctx=await getOrgContext();
 const org=ctx?await ctx.supabase.from("organizations").select("name").eq("id",ctx.orgId).maybeSingle():null;
 return <StrategyWizard initialAreaId="icp" organizationName={org?.data?.name??""}/>;
}
