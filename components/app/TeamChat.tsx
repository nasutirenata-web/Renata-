"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Send, MessagesSquare } from "lucide-react";
import { listTeamMessages, sendTeamMessage, type TeamMessage } from "@/app/(app)/mensajes/actions";
import { cn } from "@/lib/utils";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("es-AR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" });
}

export function TeamChat() {
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [pending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);
  const lastCount = useRef(0);

  const refresh = useCallback(async () => {
    const res = await listTeamMessages();
    if (res.error) setError(res.error);
    else {
      setError(null);
      setMessages(res.messages);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const initial = setTimeout(refresh, 0);
    const id = setInterval(refresh, 5000);
    return () => { clearTimeout(initial); clearInterval(id); };
  }, [refresh]);

  useEffect(() => {
    if (messages.length !== lastCount.current) {
      lastCount.current = messages.length;
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || pending) return;
    startTransition(async () => {
      const res = await sendTeamMessage(text);
      if (res.error) {
        setError(res.error);
        return;
      }
      setDraft("");
      await refresh();
    });
  }

  return (
    <div className="glass-panel flex h-[calc(100vh-15rem)] min-h-[420px] flex-col overflow-hidden rounded-3xl">
      <div className="flex-1 space-y-3 overflow-y-auto p-5 [scrollbar-width:thin]" aria-live="polite">
        {loading && <p className="text-center text-sm text-muted">Cargando mensajes…</p>}
        {!loading && messages.length === 0 && !error && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <span className="glass-icon flex h-12 w-12 items-center justify-center rounded-2xl text-brand">
              <MessagesSquare className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <p className="text-sm font-medium text-foreground">Todavía no hay mensajes</p>
            <p className="max-w-xs text-xs text-muted">
              Escribí el primero: lo ve todo el equipo de tu organización.
            </p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex flex-col gap-1", m.mine ? "items-end" : "items-start")}>
            <span className="px-2 text-[10px] text-muted-2">
              {m.mine ? "Vos" : m.authorName} · {formatTime(m.createdAt)}
            </span>
            <p
              className={cn(
                "lead-row max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm",
                m.mine ? "border-brand/40" : "",
              )}
            >
              {m.body}
            </p>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-surface-border/60 p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={2000}
          placeholder="Escribí un mensaje para el equipo…"
          aria-label="Mensaje para el equipo"
          className="w-full rounded-full border border-surface-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={pending || !draft.trim()}
          aria-label="Enviar mensaje"
          className="capsule-button capsule-button-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
      {error && <p className="px-5 pb-3 text-xs text-warning">{error}</p>}
    </div>
  );
}
