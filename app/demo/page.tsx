import type { Metadata } from "next";
import { DemoApp } from "@/components/demo/DemoApp";

export const metadata: Metadata = {
  title: "Demo · Capsule GTM",
  description: "Recorré Capsule GTM con datos de ejemplo: estrategia, prospección, CRM y medidor de KPIs. Nada se guarda ni se envía.",
  alternates: { canonical: "/demo" },
  openGraph: {
    title: "Demo · Capsule GTM",
    description: "Recorré Capsule GTM con datos de ejemplo. Nada se guarda ni se envía.",
    url: "https://capsule-gtm.com.ar/demo",
    siteName: "Capsule GTM",
    locale: "es_AR",
    type: "website",
  },
};

export default async function DemoPage({ searchParams }: { searchParams: Promise<{ vista?: string }> }) {
  const { vista } = await searchParams;
  return <DemoApp initial={vista} />;
}
