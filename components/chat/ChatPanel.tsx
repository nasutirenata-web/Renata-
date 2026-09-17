"use client";

import { useRef, useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn, markdownLiteToHtml } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setNotice(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.message ?? "No se pudo generar respuesta.");
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch {
      setNotice("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto p-8">
        {messages.length === 0 && (
          <div className="mx-auto max-w-md pt-16 text-center text-sm text-muted">
            Preguntame sobre estrategia, ICP, prospección o cualquiera de las
            herramientas del Studio. El historial no se guarda todavía — se va a
            persistir cuando conectes Supabase.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-3", m.role === "user" && "justify-end")}>
            {m.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-lime">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={cn(
                "max-w-xl whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-lime text-lime-foreground"
                  : "border border-surface-border bg-surface text-foreground/90",
              )}
              {...(m.role === "assistant"
                ? { dangerouslySetInnerHTML: { __html: markdownLiteToHtml(m.content) } }
                : { children: m.content })}
            />
            {m.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-lime">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl border border-surface-border bg-surface px-4 py-3 text-sm text-muted">
              Escribiendo…
            </div>
          </div>
        )}
        {notice && (
          <div className="mx-auto max-w-md rounded-2xl border border-warning/30 bg-warning/10 p-4 text-center text-sm text-warning">
            {notice}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-surface-border/60 p-4">
        <div className="mx-auto flex max-w-3xl items-end gap-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Escribí tu mensaje…"
            className="flex-1 resize-none rounded-2xl border border-surface-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-lime"
          />
          <Button onClick={send} disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
