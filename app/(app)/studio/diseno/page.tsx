import { PageHeader } from "@/components/app/PageHeader";
import { ImageDesigner } from "@/components/studio/ImageDesigner";

export default function DisenoPage() {
  return (
    <>
      <PageHeader
        title="Diseño de imágenes"
        description="Componé piezas on-brand para publicaciones. Se genera en tu navegador, sin depender de un proveedor externo."
      />
      <ImageDesigner />
    </>
  );
}
