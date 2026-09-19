import type { Metadata } from "next";
import { DemoApp } from "@/components/demo/DemoApp";

export const metadata: Metadata = {
  title: "Demo · Capsule GTM",
  description: "Recorré Capsule GTM con datos de ejemplo. Nada se guarda ni se envía. Después, 7 días de prueba gratis.",
};

export default async function DemoPage({ searchParams }: { searchParams: Promise<{ vista?: string }> }) {
  const { vista } = await searchParams;
  return <DemoApp initial={vista} />;
}
