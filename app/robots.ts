import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/crm",
          "/studio",
          "/build",
          "/prospeccion",
          "/chat",
          "/mensajes",
          "/social",
          "/configuracion",
          "/admin",
          "/api/",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: "https://capsule-gtm.com.ar/sitemap.xml",
  };
}
