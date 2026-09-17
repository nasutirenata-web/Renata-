"use client";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const SCENES = [
  {
    prompt: "Generá un email frío para el director de compras de una fintech B2B",
    response: "Asunto: Menos fricción en tu proceso de compras\n\nHola {{nombre}}, vi que {{empresa}} está sumando proveedores este trimestre. Ayudamos a equipos como el tuyo a...",
  },
  {
    prompt: "Calificá estos 12 contactos nuevos por temperatura",
    response: "🔴 4 calientes · 🟠 5 tibios · 🔵 3 fríos\nPriorizá los 4 calientes: mencionaron presupuesto activo esta semana.",
  },
  {
    prompt: "Armá el argumentario para \"ya tenemos un proveedor\"",
    response: "Tiene sentido. ¿Qué tan conforme está tu equipo con los tiempos de respuesta actuales? La mayoría de nuestros clientes llegó por eso, no por precio.",
  },
];

const TYPE_MS = 28;
const PAUSE_AFTER_PROMPT_MS = 350;
const RESPONSE_HOLD_MS = 2600;
const SCENE_GAP_MS = 900;

export function TerminalDemo() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [typedPrompt, setTypedPrompt] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    setTypedPrompt("");
    setShowResponse(false);
    const scene = SCENES[sceneIndex];
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const typeNext = () => {
      i += 1;
      setTypedPrompt(scene.prompt.slice(0, i));
      if (i < scene.prompt.length) {
        timers.push(setTimeout(typeNext, TYPE_MS));
      } else {
        timers.push(
          setTimeout(() => setShowResponse(true), PAUSE_AFTER_PROMPT_MS)
        );
        timers.push(
          setTimeout(
            () => setSceneIndex((s) => (s + 1) % SCENES.length),
            PAUSE_AFTER_PROMPT_MS + RESPONSE_HOLD_MS + SCENE_GAP_MS
          )
        );
      }
    };
    timers.push(setTimeout(typeNext, TYPE_MS));
    return () => timers.forEach(clearTimeout);
  }, [sceneIndex]);

  const scene = SCENES[sceneIndex];

  return (
    <div className="capsule-terminal" aria-label="Demostración del asistente de Capsule GTM">
      <div className="capsule-terminal-bar">
        <span className="capsule-terminal-dot" />
        <span className="capsule-terminal-dot" />
        <span className="capsule-terminal-dot" />
        <span className="ml-3 text-[11px] tracking-wide text-muted">capsule · asistente gtm</span><span className="ml-auto text-[10px] text-muted">Vista de ejemplo</span>
      </div>
      <div className="capsule-terminal-body">
        <p className="flex items-start gap-2 text-[13px] sm:text-sm">
          <span className="text-brand">❯</span>
          <span>
            {typedPrompt}
            {!showResponse && <span className="capsule-terminal-cursor" />}
          </span>
        </p>
        {showResponse && (
          <p className="mt-4 flex items-start gap-2 whitespace-pre-line text-[13px] leading-relaxed text-muted sm:text-sm">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} />
            <span>{scene.response}</span>
          </p>
        )}
      </div>
    </div>
  );
}
