"use server";

import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { parseProfileForm } from "@/lib/profile";

export type ProfileState = { status: "idle" | "ok" | "error"; message: string };

export async function updateProfile(_previous: ProfileState, formData: FormData): Promise<ProfileState> {
  if (!isSupabaseConfigured()) return { status: "error", message: "Supabase no está configurado, no se puede guardar el perfil." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Iniciá sesión para editar tu perfil." };

  const parsed = parseProfileForm(formData);
  if (parsed.error !== null) return { status: "error", message: parsed.error };

  const { error } = await supabase.auth.updateUser({ data: parsed.metadata });
  if (error) return { status: "error", message: "No se pudo guardar el perfil. Volvé a intentar." };

  // El nombre completo también se copia a la tabla de perfiles, que ya tiene ese campo.
  await supabase.from("profiles").update({ full_name: parsed.metadata.full_name }).eq("id", user.id);

  revalidatePath("/configuracion/perfil");
  revalidatePath("/mensajes");
  return { status: "ok", message: "Perfil guardado." };
}
