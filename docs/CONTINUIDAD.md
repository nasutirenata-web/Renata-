# Capsule GTM — continuidad

Proyecto canónico: C:\Users\Renata\Proyecto capsule gtm. Hosting vigente: https://capsule-gtm.vercel.app. La URL chatgpt.site corresponde al prototipo anterior.

## Diseño solicitado el 17 de septiembre de 2026

Renata pidió reemplazar toda la estética oscura/lima por el estilo de su referencia Liquid Glass Kit: lila y verde agua, transparencia, reflejos y botones con volumen. El tema compartido está en app/globals.css y se aplica a landing, acceso, plataforma y administración. Mantener legibilidad con texto oscuro y estados semánticos de error/aviso. No confundir transparencia con quitar el fondo: el fondo suave permite ver las capas de vidrio.

Paleta: niebla #e9e8f0; lila #9167f5; verde agua #39d2cc; tinta #28243c; acento legible #6542b7. Tipografía: Manrope, DM Sans y Geist Mono. Los tokens brand reemplazan el nombre de color lime.

Logo nuevo: public/logo-liquid-glass.png. El original public/logo-transparent.png se conserva. Variante creada con image_gen integrado; prompt: conservar la forma, ángulo y composición horizontal del logo Capsule GTM, sustituir lima por vidrio turquesa #30D6CD y violeta #8053F6, palabra capsule y GTM en violeta oscuro legible sobre fondo claro, transparencia alfa real, sin nuevos símbolos.

## Funcionalidad y configuración

Conservar todas las rutas, el menú y los formularios. Este cambio visual no altera credenciales, usuarios, membresías ni proveedores. Gemini y Supabase usan las variables existentes. Nunca versionar secretos ni simular conexiones o guardados.

LinkedIn y WhatsApp siguen requiriendo completar las integraciones correspondientes; el cambio de diseño no las activa. No afirmar que toda la operación comercial está implementada solo por tener las páginas.

## Colaboración

Base al comenzar este cambio: d714954, árbol limpio. Incluye la fusión previa con Claude. No reescribir el historial ni usar force push. Referencias antiguas en referencias/proyecto-original. Consultar git log y el estado real antes de reutilizar resúmenes antiguos.
