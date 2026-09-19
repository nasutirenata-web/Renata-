import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "avatars";
const MAX_BYTES = 2 * 1024 * 1024;

// Se comprueba el contenido real del archivo, no solo lo que declara el navegador.
const KINDS: { type: string; ext: string; matches: (b: Uint8Array) => boolean }[] = [
  { type: "image/jpeg", ext: "jpg", matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: "image/png", ext: "png", matches: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  {
    type: "image/webp",
    ext: "webp",
    matches: (b) => b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  },
];

async function currentUser() {
  if (!isSupabaseConfigured()) return { supabase: null, user: null };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

async function ensureBucket(admin: ReturnType<typeof createAdminClient>) {
  const { data } = await admin.storage.getBucket(BUCKET);
  if (data) return true;
  const { error } = await admin.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_BYTES,
    allowedMimeTypes: KINDS.map((k) => k.type),
  });
  return !error;
}

async function removeExisting(admin: ReturnType<typeof createAdminClient>, userId: string) {
  const { data } = await admin.storage.from(BUCKET).list(userId);
  if (data?.length) await admin.storage.from(BUCKET).remove(data.map((f) => `${userId}/${f.name}`));
}

export async function POST(req: NextRequest) {
  const { supabase, user } = await currentUser();
  if (!supabase || !user) return NextResponse.json({ error: "Iniciá sesión para cambiar tu foto." }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("photo");
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Elegí una foto." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "La foto pesa más de 2 MB. Elegí una más liviana." }, { status: 413 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = KINDS.find((k) => k.matches(bytes));
  if (!kind) return NextResponse.json({ error: "Usá una foto en formato JPG, PNG o WebP." }, { status: 400 });

  const admin = createAdminClient();
  if (!(await ensureBucket(admin))) return NextResponse.json({ error: "No se pudo preparar el almacenamiento de fotos." }, { status: 500 });

  // La ruta sale de la sesión, nunca del pedido: cada persona solo escribe en su propia carpeta.
  await removeExisting(admin, user.id);
  const path = `${user.id}/${Date.now()}.${kind.ext}`;
  const { error: uploadError } = await admin.storage.from(BUCKET).upload(path, bytes, { contentType: kind.type, upsert: true });
  if (uploadError) return NextResponse.json({ error: "No se pudo subir la foto. Volvé a intentar." }, { status: 500 });

  const avatarUrl = admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  const { error } = await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } });
  if (error) return NextResponse.json({ error: "La foto se subió, pero no se pudo asociar a tu perfil." }, { status: 500 });

  return NextResponse.json({ avatarUrl });
}

export async function DELETE() {
  const { supabase, user } = await currentUser();
  if (!supabase || !user) return NextResponse.json({ error: "Iniciá sesión para cambiar tu foto." }, { status: 401 });

  await removeExisting(createAdminClient(), user.id);
  const { error } = await supabase.auth.updateUser({ data: { avatar_url: "" } });
  if (error) return NextResponse.json({ error: "No se pudo quitar la foto." }, { status: 500 });
  return NextResponse.json({ avatarUrl: null });
}
