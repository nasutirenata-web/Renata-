# Capsule GTM

Sistema de Go-to-Market B2B: estrategia, CRM, canales de contacto (email/WhatsApp),
Studio de contenido y diseño, y un chat asistente — construido a partir del caso de
distribución a farmacias y comercios.

## Estado actual

- ✅ Landing page, navegación y esqueleto completo de la plataforma (Dashboard, CRM,
  Studio, Chat, Configuración).
- ✅ 12 herramientas comerciales del Studio (email en frío, propuestas, objeciones,
  posts de LinkedIn, briefings, etc.), generadas con IA vía Anthropic si hay API key.
- ✅ Diseño de imágenes para publicaciones (compone PNG en el navegador, sin proveedor externo).
- ✅ Chat asistente conectado a Anthropic (si hay API key configurada).
- ✅ Scaffold de conexión OAuth con LinkedIn (requiere credenciales propias).
- ⏳ **Pendiente de credenciales**: persistencia real (Supabase), cuentas de usuario
  reales, CRM con datos guardados. Sin esto, las pantallas de CRM muestran estados
  vacíos honestos en vez de datos falsos.

## Cómo correrlo localmente

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá lo que tengas disponible:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
  — creá un proyecto gratis en [supabase.com](https://supabase.com/dashboard). Sin esto,
  no hay cuentas reales ni CRM persistente.
- `ANTHROPIC_API_KEY` — activa el Studio (generación con IA) y el Chat. Se genera en
  [console.anthropic.com](https://console.anthropic.com).
- `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` / `LINKEDIN_REDIRECT_URI` — activa el
  botón "Conectar LinkedIn" en Configuración. Se crea una app en
  [linkedin.com/developers/apps](https://www.linkedin.com/developers/apps).

Ninguna funcionalidad interna se simula: si falta una variable, el módulo
correspondiente lo muestra explícitamente en vez de fingir que está conectado.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Supabase (auth + Postgres) ·
Anthropic (generación) · lucide-react (íconos).

## Estructura

- `app/page.tsx` — landing pública.
- `app/(app)/` — plataforma autenticada (dashboard, crm, studio, chat, configuración).
- `lib/skills/` — las 12 skills comerciales originales, usadas como prompt de sistema
  para cada herramienta del Studio.
- `lib/skills-registry.ts` — metadata de cada herramienta (título, módulo, campos).
- `supabase/schema.sql` — esquema de base de datos propuesto (organizaciones, CRM,
  contenido, integraciones) con RLS por organización.

## Deploy

```bash
vercel --prod
```

Después del primer deploy, cargá las variables de entorno de arriba en el dashboard
de Vercel (Project Settings → Environment Variables) y volvé a desplegar.
