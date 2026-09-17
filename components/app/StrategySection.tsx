"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Save, Check } from "lucide-react";
export type StrategyField={name:string;label:string;placeholder?:string;rows?:number};
export function StrategySection({title,description,fields}:{title:string;description:string;fields:StrategyField[]}) {
 const pathname=usePathname();
 const section=pathname+":"+title;
 const [values,setValues]=useState<Record<string,string>>({});
 const [loading,setLoading]=useState(true);
 const [saving,setSaving]=useState(false);
 const [saved,setSaved]=useState(false);
 const [notice,setNotice]=useState("");
 useEffect(()=>{const controller=new AbortController();fetch("/api/strategy?section="+encodeURIComponent(section),{signal:controller.signal}).then(async r=>{const data=await r.json();if(!r.ok)throw new Error(data.error);setValues(data.values);}).catch(e=>{if(e.name!=="AbortError")setNotice(e.message??"No se pudo cargar el borrador.");}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();},[section]);
 async function save(){setSaving(true);setNotice("");setSaved(false);try{const r=await fetch("/api/strategy",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({section,values})});const d=await r.json();if(!r.ok)throw new Error(d.error);setSaved(true);}catch(e){setNotice(e instanceof Error?e.message:"No se pudo guardar.");}finally{setSaving(false);}}
 return <Card className="flex flex-col gap-4"><div><CardTitle>{title}</CardTitle><CardDescription className="mt-1">{description}</CardDescription></div>{fields.map(f=><label key={f.name} className="flex flex-col gap-2 text-sm">{f.label}<textarea name={f.name} rows={f.rows??3} placeholder={f.placeholder} disabled={loading} value={values[f.name]??""} onChange={e=>{setValues({...values,[f.name]:e.target.value});setSaved(false);}} className="resize-y rounded-2xl border border-surface-border bg-surface-2 px-4 py-3 text-base leading-relaxed outline-none focus:border-lime disabled:opacity-50"/></label>)}<div className="flex flex-wrap items-center gap-4"><Button size="sm" variant="secondary" onClick={save} disabled={loading||saving}>{saved?<Check className="h-4 w-4"/>:<Save className="h-4 w-4"/>}{saving?"Guardando…":saved?"Guardado":"Guardar borrador"}</Button><p role="status" className={"text-xs "+(notice?"text-warning":"text-muted")}>{loading?"Cargando borrador…":notice|| (saved?"Guardado en tu organización.":"Tus cambios se guardan al pulsar el botón.")}</p></div></Card>;
}
