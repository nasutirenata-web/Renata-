"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { LayoutDashboard, Building2, Users, KanbanSquare, Activity, Palette, Bot, Settings, CalendarDays, Search, Target, Compass, Tag, DollarSign, Radio, Share2, ImageIcon, Menu, X, ArrowUpRight, LogOut } from "lucide-react";
const groups = [
  { label: "Inicio", items: [{href:"/dashboard",label:"Dashboard",icon:LayoutDashboard}] },
  { label: "Build · estrategia", items: [
    {href:"/build/estrategia",label:"Estrategia",icon:Target},{href:"/build/icp",label:"ICP",icon:Compass},{href:"/build/oferta",label:"Oferta y catálogo",icon:Tag},{href:"/build/precios",label:"Precios",icon:DollarSign},{href:"/build/canales",label:"Canales",icon:Radio}] },
  { label: "Outbound · captación", items: [{href:"/prospeccion",label:"Prospección",icon:Search}] },
  { label: "CRM · relaciones", items: [{href:"/crm",label:"Resumen del CRM",icon:KanbanSquare},{href:"/crm/empresas",label:"Empresas",icon:Building2},{href:"/crm/contactos",label:"Contactos",icon:Users},{href:"/crm/pipeline",label:"Pipeline",icon:KanbanSquare},{href:"/crm/actividad",label:"Actividad",icon:Activity}] },
  { label: "Studio · contenido", items: [{href:"/studio",label:"Herramientas",icon:Palette},{href:"/studio/diseno",label:"Diseño de imágenes",icon:ImageIcon},{href:"/studio/calendario",label:"Calendario editorial",icon:CalendarDays},{href:"/social/linkedin",label:"LinkedIn",icon:Share2}] },
  { label: "Asistente", items: [{href:"/chat",label:"Chat",icon:Bot}] },
];
export function AppShell({ children, organizationName, hasSession = false }: {children:React.ReactNode;organizationName?:string;hasSession?:boolean}) {
  const pathname=usePathname();
  const [mobileOpen,setMobileOpen]=useState(false);
  const current=groups.flatMap(g=>g.items).find(i=>i.href===pathname);
  const navigation=<nav aria-label="Menú de la plataforma" className="space-y-5 px-3 pb-5">{groups.map(g=><div key={g.label}><p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[.16em] text-muted-2">{g.label}</p><div className="space-y-0.5">{g.items.map(item=>{const active=pathname===item.href;return <Link key={item.href} href={item.href} onClick={()=>setMobileOpen(false)} aria-current={active?"page":undefined} className={"flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors "+(active?"border-lime/20 bg-lime/10 text-lime":"border-transparent text-foreground/80 hover:bg-surface-2 hover:text-foreground")}><item.icon className="h-4 w-4 shrink-0" strokeWidth={1.6}/>{item.label}</Link>})}</div></div>)}<div className="border-t border-surface-border pt-3"><Link onClick={()=>setMobileOpen(false)} href="/configuracion/integraciones" aria-current={pathname.startsWith("/configuracion")?"page":undefined} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted hover:bg-surface-2 hover:text-lime"><Settings className="h-4 w-4"/>Configuración</Link>{hasSession&&<form action="/api/auth/logout" method="post"><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted hover:text-lime"><LogOut className="h-4 w-4"/>Cerrar sesión</button></form>}</div></nav>;
  return <div className="flex min-h-screen">
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-surface-border/70 bg-[#2a2d27]/80 backdrop-blur-xl md:flex">
      <div className="px-6 pb-7 pt-8"><Link href="/" aria-label="Capsule GTM, ir al inicio"><Logo height={45}/></Link></div>
      <div className="flex-1 overflow-y-auto [scrollbar-width:thin]">{navigation}</div>
      <div className="m-3 rounded-2xl border border-surface-border bg-surface/70 p-4"><p className="text-xs font-medium text-foreground">{organizationName??"Tu espacio Capsule"}</p><p className="mt-1 text-xs leading-relaxed text-muted">{hasSession?"Sesión iniciada · datos de tu organización":"Iniciá sesión para trabajar con datos compartidos."}</p>{!hasSession&&<Link href="/login" className="mt-3 inline-flex items-center gap-2 text-xs text-lime">Ingresar <ArrowUpRight className="h-3 w-3"/></Link>}</div>
    </aside>
    <div className="flex min-h-screen min-w-0 flex-1 flex-col">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-surface-border/70 bg-background/95 px-5 py-4 backdrop-blur-xl md:hidden"><Link href="/"><Logo height={32}/></Link><button aria-label={mobileOpen?"Cerrar menú":"Abrir menú"} aria-expanded={mobileOpen} aria-controls="mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)} className="rounded-xl border border-surface-border p-2 text-lime">{mobileOpen?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}</button></header>
      {mobileOpen&&<div id="mobile-menu" className="max-h-[75vh] overflow-y-auto border-b border-surface-border bg-surface py-5 md:hidden">{navigation}</div>}
      <div className="hidden items-center justify-between border-b border-surface-border/50 px-8 py-3 text-xs text-muted md:flex"><span>Tu espacio de trabajo <span className="px-2 text-muted-2">/</span> {current?.label??"Capsule GTM"}</span><span>Marketing · IA · Tecnología</span></div>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  </div>;
}
