import { createClient } from "@supabase/supabase-js";

// Solo para código de servidor (acciones y rutas): usa la service role key.
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
