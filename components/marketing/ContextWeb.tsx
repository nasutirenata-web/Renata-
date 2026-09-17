import { Search, Sparkles, ArrowUpRight, Pencil, MessagesSquare, Zap } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
export function ContextWeb() {
  return <div className="w-full overflow-hidden rounded-[32px] border border-[#4c5144] bg-[#2e312c]/80 p-5 sm:p-6" aria-label="Mapa de contexto de Capsule GTM">
    <div className="flex items-center justify-between gap-3 text-[10px] tracking-[.13em] text-muted"><span>UN SOLO CONTEXTO. TODO TU GTM.</span><Zap className="h-6 w-6 text-lime" strokeWidth={1.4}/></div>
    <div className="context-orbit">
      <div className="context-ring"/><div className="context-ring outer"/>
      <div className="absolute left-1/2 top-1/2 flex w-44 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 rounded-full border border-lime/25 bg-[#252b1e]/95 px-5 py-6 shadow-[0_0_50px_#d9f99b12]"><Logo height={35}/><span className="text-[10px] text-lime/80">Tu negocio, conectado.</span></div>
      <span className="context-node left-0 top-12"><Search/>Datos & señales</span><span className="context-node right-0 top-7"><Sparkles/>Estrategia</span>
      <span className="context-node right-0 top-[170px]"><ArrowUpRight/>Pipeline</span><span className="context-node bottom-14 left-1"><Pencil/>Contenido</span><span className="context-node bottom-0 right-7"><MessagesSquare/>Conversaciones</span>
    </div>
    <div className="mt-4 flex justify-between gap-3 border-t border-[#484d40] pt-4 text-[9px] tracking-wider text-muted"><span>INTELIGENCIA COMPARTIDA</span><span className="text-lime">Personas al mando ↗</span></div>
  </div>;
}
