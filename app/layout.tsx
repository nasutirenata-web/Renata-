import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Manrope, Poppins } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const SITE = "https://capsule-gtm.com.ar";

// Datos estructurados para Google: solo hechos verificables (nombre, URL, logo, idioma). Sin precios ni valoraciones.
const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE}/#organization`, name: "Capsule GTM", url: SITE, logo: `${SITE}/icon.png` },
    { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: "Capsule GTM", inLanguage: "es-AR", publisher: { "@id": `${SITE}/#organization` } },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://capsule-gtm.com.ar"),
  alternates: { canonical: "/" },
  title: "Capsule GTM — Sistema de Go-to-Market B2B",
  description:
    "Estrategia, datos, CRM, contenido y ventas para empresas de marketing, inteligencia artificial y tecnología. Todo tu GTM en una Capsule.",
  openGraph: {
    title: "Capsule GTM — Sistema de Go-to-Market B2B",
    description:
      "Estrategia, datos, CRM, contenido y ventas para empresas de marketing, inteligencia artificial y tecnología. Todo tu GTM en una Capsule.",
    url: "https://capsule-gtm.com.ar",
    siteName: "Capsule GTM",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${dmSans.variable} ${geistMono.variable} ${manrope.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }} />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('capsule-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
