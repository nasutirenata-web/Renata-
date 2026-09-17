import { AdminShell } from "@/components/admin/AdminShell";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) notFound();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();
  const { data, error } = await supabase.rpc("is_platform_admin");
  if (error || !data) notFound();
  return <AdminShell>{children}</AdminShell>;
}
