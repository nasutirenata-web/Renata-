import type { MetadataRoute } from "next";

const SITE = "https://capsule-gtm.com.ar";

// Solo páginas públicas e indexables. La plataforma (CRM, Studio, etc.) requiere sesión y queda afuera.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/demo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
