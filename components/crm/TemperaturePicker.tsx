"use client";
import { useState, useTransition } from "react";
import { setTemperature } from "@/app/(app)/crm/contactos/actions";
import { TemperatureControl, type Temperature } from "./TemperatureControl";
export function TemperaturePicker({contactId,value}:{contactId:string;value:Temperature}) {
 const [pending,startTransition]=useTransition();
 const [notice,setNotice]=useState("");
 return <div className="flex flex-col items-end"><TemperatureControl value={value} disabled={pending} onChange={temp=>startTransition(async()=>{setNotice("");try{const result=await setTemperature(contactId,temp);setNotice(result.error??"Guardado");}catch{setNotice("No se pudo guardar. Volvé a intentar.");}})}/><p role="status" className="max-w-40 text-right text-[10px] text-muted">{pending?"Guardando…":notice}</p></div>;
}
