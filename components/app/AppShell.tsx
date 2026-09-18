"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LayoutDashboard, Building2, Users, KanbanSquare, Activity, Palette, Bot, Settings, CalendarDays, Search, SlidersHorizontal, Target, Compass, Tag, DollarSign, Radio, Share2, ImageIcon, Menu, X, ArrowUpRight, LogOut, MessagesSquare, ChevronDown, ChevronRight } from "lucide-react";

const groups = [
  { id:"build", label:"Estrategia", caption:"Build", tone:"violet", icon:Target, items:[
    {href:"/build/estrategia",label:"Estrategia B2B",icon:Target},
    {href:"/build/icp",label:"Cliente ideal · ICP",icon:Compass},
    {href:"/build/oferta",label:"Oferta y catálogo",icon:Tag},
    {href:"/build/precios",label:"Precios",icon:DollarSign},
    {href:"/build/canales",label:"Canales",icon:Radio},
  ]},
  { id:"outbound", label:"Prospección", caption:"Outbound", tone:"aqua", icon:Search, items:[
    {href:"/prospeccion",label:"Buscar oportunidades",icon:Search},
    {href:"/prospeccion/avanzada",label:"Búsqueda avanzada",icon:SlidersHorizontal},
  ]},
  { id:"crm", label:"CRM", caption:"Relaciones", tone:"aqua", icon:KanbanSquare, items:[
    {href:"/crm",label:"Resumen del CRM",icon:KanbanSquare},
    {href:"/crm/empresas",label:"Empresas",icon:Building2},
    {href:"/crm/contactos",label:"Contactos",icon:Users},
    {href:"/crm/pipeline",label:"Pipeline",icon:KanbanSquare},
    {href:"/crm/actividad",label:"Actividad",icon:Activity},
  ]},
  { id:"studio", label:"Studio y LinkedIn", caption:"Contenido", tone:"violet", icon:Palette, items:[
    {href:"/studio",label:"Herramientas",icon:Palette},
    {href:"/studio/diseno",label:"Diseño de imágenes",icon:ImageIcon},
    {href:"/studio/calendario",label:"Calendario editorial",icon:CalendarDays},
    {href:"/social/linkedin",label:"LinkedIn",icon:Share2},
  ]},
];

export function AppShell({children,organizationName,hasSession=false}:{children:React.ReactNode;organizationName?:string;hasSession?:boolean}) {
  const pathname=usePathname();
  const [mobileOpen,setMobileOpen]=useState(false);
  const [query,setQuery]=useState("");
  const [collapsed,setCollapsed]=useState<string[]>([]);
  const currentGroup=groups.find(g=>g.items.some(i=>pathname===i.href || (i.href!=="/crm" && pathname.startsWith(i.href+"/"))));
  const allItems=groups.flatMap(g=>g.items);
  const current=allItems.find(i=>i.href===pathname);
  const pageName=current?.label ?? (pathname==="/dashboard"?"Dashboard":pathname==="/chat"?"Asistente GTM":pathname==="/mensajes"?"Mensajes":pathname.startsWith("/configuracion")?"Configuración":"Capsule GTM");
  const normalize=(text:string)=>text.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const filtered=groups.map(g=>({...g,items:g.items.filter(i=>normalize(g.label+" "+i.label+" "+g.caption).includes(normalize(query)))})).filter(g=>g.items.length);
  const closeMenu=()=>setMobileOpen(false);
  const toggle=(id:string)=>setCollapsed(previous=>previous.includes(id)?previous.filter(x=>x!==id):[...previous,id]);
  const navigation=<>
    <div className="mx-4 mb-5">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted"/>
        <input aria-label="Buscar una sección del menú" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar una sección…" className="w-full rounded-2xl border border-white/80 bg-white/45 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-brand"/>
      </label>
    </div>
    <nav aria-label="Menú de la plataforma" className="px-3 pb-5">
      <Link href="/dashboard" onClick={closeMenu} aria-current={pathname==="/dashboard"?"page":undefined} className={"workspace-shortcut "+(pathname==="/dashboard"?"capsule-nav-active":"")}><LayoutDashboard className="h-4 w-4"/>Dashboard<ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-60"/></Link>
      <div className="workspace-path mt-5 space-y-3">
        {filtered.map(g=>{
          const active=currentGroup?.id===g.id;
          const expanded=!!query || !collapsed.includes(g.id);
          return <div key={g.id} className={"workspace-group "+(g.tone==="aqua"?"workspace-aqua":"workspace-violet")} data-active={active}>
            <button type="button" className="workspace-group-toggle" onClick={()=>toggle(g.id)} aria-expanded={expanded} aria-controls={"nav-"+g.id}>
              <span className="workspace-group-orb"><g.icon className="h-4 w-4" strokeWidth={1.7}/></span>
              <span className="min-w-0 flex-1 text-left"><span className="block text-sm font-semibold">{g.label}</span><span className="text-[10px] text-muted">{g.caption}</span></span>
              <ChevronDown className={"h-3.5 w-3.5 text-muted transition-transform "+(expanded?"":"-rotate-90")}/>
            </button>
            {expanded&&<div id={"nav-"+g.id} className="workspace-submenu mt-1 space-y-1">{g.items.map(item=><Link key={item.href} href={item.href} onClick={closeMenu} aria-current={pathname===item.href?"page":undefined} className={"workspace-nav-item "+(pathname===item.href?"capsule-nav-active":"")}><item.icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.7}/><span>{item.label}</span>{pathname===item.href&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true"/>}</Link>)}</div>}
          </div>;
        })}
        {filtered.length===0&&<p className="px-3 py-4 text-xs text-muted" role="status">No hay secciones con ese nombre.</p>}
      </div>
      <div className="mt-5 space-y-1 border-t border-white/80 pt-4">
        <Link href="/mensajes" onClick={closeMenu} aria-current={pathname==="/mensajes"?"page":undefined} className={"workspace-shortcut "+(pathname==="/mensajes"?"capsule-nav-active":"")}><MessagesSquare className="h-4 w-4"/>Mensajes</Link>
        <Link href="/chat" onClick={closeMenu} aria-current={pathname==="/chat"?"page":undefined} className={"workspace-shortcut "+(pathname==="/chat"?"capsule-nav-active":"")}><Bot className="h-4 w-4"/>Asistente GTM</Link>
        <Link href="/configuracion/integraciones" onClick={closeMenu} aria-current={pathname.startsWith("/configuracion")?"page":undefined} className={"workspace-shortcut "+(pathname.startsWith("/configuracion")?"capsule-nav-active":"")}><Settings className="h-4 w-4"/>Configuración</Link>
        {hasSession&&<form action="/api/auth/logout" method="post"><button className="workspace-shortcut w-full text-muted"><LogOut className="h-4 w-4"/>Cerrar sesión</button></form>}
      </div>
    </nav>
  </>;
  return <div className="capsule-app flex min-h-screen">
    <aside className="capsule-sidebar sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col border-r md:flex">
      <div className="px-6 pb-3 pt-5"><Link href="/" aria-label="Capsule GTM, ir al inicio"><Logo height={63}/></Link></div>
      <div className="flex-1 overflow-y-auto [scrollbar-width:thin]">{navigation}</div>
      <div className="glass-panel m-3 flex items-center gap-3 rounded-2xl p-3">
        <span className="glass-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-brand"><Building2 className="h-4 w-4"/></span>
        <div className="min-w-0"><p className="truncate text-xs font-medium">{organizationName??"Tu espacio Capsule"}</p><p className="mt-1 text-[10px] text-muted">{hasSession?"Sesión iniciada":"Iniciá sesión para guardar"}</p></div>
      </div>
    </aside>
    <div className="flex min-h-screen min-w-0 flex-1 flex-col">
      <header className="capsule-nav sticky top-0 z-30 flex items-center justify-between gap-4 px-5 py-3 md:hidden">
        <Link href="/"><Logo height={44}/></Link>
        <button aria-label={mobileOpen?"Cerrar menú":"Abrir menú"} aria-expanded={mobileOpen} aria-controls="mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)} className="capsule-button capsule-button-glass flex h-11 w-11 items-center justify-center rounded-full">{mobileOpen?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}</button>
      </header>
      {mobileOpen&&<div id="mobile-menu" className="capsule-mobile-menu max-h-[75vh] overflow-y-auto border-b border-white/80 py-5 md:hidden">{navigation}</div>}
      <div className="capsule-workbar flex flex-wrap items-center justify-between gap-3 border-b border-white/65 px-5 py-4 md:px-8">
        <div className="flex items-center gap-2 text-xs text-muted"><Link href="/dashboard" className="hover:text-brand">Tu espacio</Link><ChevronRight className="h-3 w-3"/><span className="font-medium text-foreground">{pageName}</span></div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="flex items-center gap-1 rounded-full border border-white/80 bg-white/30 p-1 text-[11px]">
            <Link href="/prospeccion" className={"rounded-full px-3 py-1.5 "+(currentGroup?.id==="outbound"?"capsule-button-aqua":"text-muted hover:text-aqua")}>Outbound</Link>
            <Link href="/studio" className={"rounded-full px-3 py-1.5 "+(currentGroup?.id==="studio"?"capsule-button-primary":"text-muted hover:text-brand")}>Inbound</Link>
          </div>
        </div>
      </div>
      {currentGroup && currentGroup.items.length>1&&<nav aria-label={"Secciones de "+currentGroup.label} className="workspace-tabs flex gap-2 overflow-x-auto px-5 py-3 md:px-8">
        {currentGroup.items.map(item=><Link key={item.href} href={item.href} aria-current={pathname===item.href?"page":undefined} className={"shrink-0 rounded-full border px-4 py-2 text-xs transition-all "+(pathname===item.href?"capsule-nav-active border-white":"border-white/65 bg-white/20 text-muted hover:bg-white/50")}>{item.label}</Link>)}
      </nav>}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  </div>;
}
