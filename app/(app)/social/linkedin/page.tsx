import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Share2, Pencil, ImageIcon, CalendarDays, ArrowUpRight } from "lucide-react";

export default function LinkedInPage() {
  return <><PageHeader title="LinkedIn" description="Tu espacio para preparar contenido, diseñar piezas y organizar la presencia de tu marca."/><div className="space-y-6 p-5 sm:p-8">
    <Card className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center"><div className="flex gap-4"><Share2 className="h-8 w-8 shrink-0 text-lime"/><div><CardTitle>Conectá tu cuenta de LinkedIn</CardTitle><CardDescription className="mt-2 max-w-xl">La creación de contenido y diseños está disponible en Studio. La conexión de cuenta y la publicación directa requieren completar la integración oficial.</CardDescription></div></div><div className="flex shrink-0 flex-col items-start gap-3"><Badge tone="warning">Sin conectar</Badge><LinkButton href="/configuracion/integraciones" variant="outline">Ver configuración <ArrowUpRight className="h-4 w-4"/></LinkButton></div></Card>
    <div className="grid gap-5 lg:grid-cols-3">{[
      {title:"Crear un post",icon:Pencil,body:"Prepará el mensaje, el enfoque y la llamada a la acción para tu audiencia.",href:"/studio/post-linkedin"},
      {title:"Diseñar una imagen",icon:ImageIcon,body:"Generá una pieza con IA y descargala para revisar o publicar manualmente.",href:"/studio/diseno"},
      {title:"Planificar contenido",icon:CalendarDays,body:"Trabajá pilares, frecuencia y ángulos con el planificador editorial.",href:"/studio/calendario-editorial"},
    ].map(({icon:Icon,...a})=><Card key={a.title} className="flex flex-col"><Icon className="h-7 w-7 text-lime"/><CardTitle className="mt-5">{a.title}</CardTitle><CardDescription className="mb-6 mt-3">{a.body}</CardDescription><LinkButton href={a.href} className="mt-auto w-fit">Abrir <ArrowUpRight className="h-4 w-4"/></LinkButton></Card>)}</div>
    <Card><CardTitle>Publicaciones, mensajes y métricas</CardTitle><CardDescription className="mt-3">No hay publicaciones sincronizadas. Los mensajes privados y las estadísticas dependen de los productos y permisos que LinkedIn apruebe para la aplicación; conectar una cuenta no habilita automáticamente todas esas funciones.</CardDescription><p className="mt-4 text-sm text-muted">Las piezas que crees aquí no se envían ni publican automáticamente.</p></Card>
  </div></>;
}
