"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

const MAX_BYTES = 2 * 1024 * 1024;

export function AvatarUploader({ name, avatarUrl, headline }: { name: string; avatarUrl: string | null; headline: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function send(request: () => Promise<Response>, success: string) {
    setBusy(true);
    setMessage(null);
    try {
      const res = await request();
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ ok: false, text: data.error ?? "No se pudo completar. Volvé a intentar." });
        return;
      }
      setMessage({ ok: true, text: success });
      router.refresh();
    } catch {
      setMessage({ ok: false, text: "No hay conexión con el servidor. Volvé a intentar." });
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setMessage({ ok: false, text: "La foto pesa más de 2 MB. Elegí una más liviana." });
      e.target.value = "";
      return;
    }
    const body = new FormData();
    body.set("photo", file);
    void send(() => fetch("/api/profile/avatar", { method: "POST", body }), "Foto actualizada.");
  }

  return (
    <section aria-label="Foto de perfil" className="glass-panel flex max-w-xl flex-col gap-5 rounded-3xl p-6 sm:flex-row sm:items-center">
      <Avatar name={name || "Tu perfil"} url={avatarUrl} size={96} />
      <div className="min-w-0 flex-1">
        <p className="break-words text-lg font-semibold text-foreground">{name || "Tu nombre"}</p>
        <p className="mt-0.5 break-words text-sm text-muted">{headline}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={onPick} className="sr-only" id="avatar-file" disabled={busy} />
          <Button type="button" size="sm" disabled={busy} onClick={() => input.current?.click()}>
            <Camera className="h-4 w-4" />
            {busy ? "Subiendo…" : avatarUrl ? "Cambiar foto" : "Subir foto"}
          </Button>
          {avatarUrl && (
            <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={() => void send(() => fetch("/api/profile/avatar", { method: "DELETE" }), "Foto quitada.")}>
              <Trash2 className="h-4 w-4" />
              Quitar
            </Button>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-2">JPG, PNG o WebP, hasta 2 MB.</p>
        <p role="status" className={message?.ok === false ? "mt-1 text-sm text-danger" : "mt-1 text-sm text-muted"}>{message?.text}</p>
      </div>
    </section>
  );
}
