import { PageHeader } from "@/components/app/PageHeader";
import { AIImageGenerator } from "@/components/studio/AIImageGenerator";

export default function DisenoPage() {
  return (
    <>
      <PageHeader
        title="Diseño de imágenes"
        description="Generá una imagen con IA a partir de una idea, en el formato que necesites."
      />
      <div className="p-8">
        <AIImageGenerator />
      </div>
    </>
  );
}
