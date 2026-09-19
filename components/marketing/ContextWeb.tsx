import { Search, Sparkles, ArrowUpRight, Pencil, MessagesSquare, Zap } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function ContextWeb() {
  return (
    <div className="capsule-context glass-panel w-full overflow-hidden" aria-label="Mapa de contexto de Capsule GTM">
      <div className="flex items-center justify-between gap-3 text-[10px] tracking-[.13em] text-muted">
        <span>UN SOLO CONTEXTO. TODO TU GTM.</span>
        <Zap className="h-5 w-5 text-brand" strokeWidth={1.4}/>
      </div>
      <div className="context-orbit">
        <div className="context-ring" aria-hidden="true"/><div className="context-ring outer" aria-hidden="true"/>
        <div className="context-pulse" aria-hidden="true"/><div className="context-pulse delay" aria-hidden="true"/>
        <div className="context-orbiter" aria-hidden="true"><i/><i/><i/></div>
        <div className="context-orbiter outer" aria-hidden="true"><i/><i/></div>
        <div className="context-hub">
          <Logo height={51}/>
          <span className="text-[10px] text-muted">Tu negocio, conectado.</span>
        </div>
        <span className="context-node context-node-aqua left-0 top-12"><Search/>Datos & señales</span>
        <span className="context-node context-node-violet right-0 top-7"><Sparkles/>Estrategia</span>
        <span className="context-node context-node-violet right-0 top-[170px]"><ArrowUpRight/>Pipeline</span>
        <span className="context-node context-node-aqua bottom-14 left-1"><Pencil/>Contenido</span>
        <span className="context-node bottom-0 right-7"><MessagesSquare/>Conversaciones</span>
      </div>
      <div className="mt-3 flex justify-between gap-3 border-t border-white/80 pt-4 text-[9px] tracking-wider text-muted">
        <span>INTELIGENCIA COMPARTIDA</span>
        <span className="flex items-center gap-2 text-aqua"><i className="context-status" aria-hidden="true"/>Personas al mando</span>
      </div>
    </div>
  );
}
