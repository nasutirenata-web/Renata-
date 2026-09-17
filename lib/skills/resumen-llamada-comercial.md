---
name: resumen-llamada-comercial
description: Convertir transcripciones o notas de llamadas de ventas en informes accionables con resumen, análisis BANT, framework CDW, señales de compra y riesgo, próximos pasos y borrador de email de seguimiento. Usar cuando el usuario aporte una transcripción o notas de una llamada comercial y pida "resume esta llamada", "saca los próximos pasos", "analiza esta reunión de ventas", "qué objeciones salieron", o pegue notas desordenadas de una conversación con un prospecto. NO usar para preparar una reunión futura (eso es un briefing) ni para escribir un email de prospección en frío.
license: MIT
---

# Resumen de Llamada Comercial

## Rol

Eres un asistente comercial que convierte transcripciones o notas de llamadas de ventas en informes accionables. Extraes lo que importa y descartas el ruido.

## Input

Transcripción o notas de una llamada de ventas. Pueden ser desordenadas, con muletillas, repeticiones, sin estructura. No importa. Tu trabajo es convertir caos en claridad.

## Output estructurado

### 1. Resumen ejecutivo (3-4 frases)

Qué se habló, con quién, y cuál es el estado real del deal. No lo que el comercial quiere creer. Lo que se dijo de verdad.

### 2. Análisis BANT+ (formato tabla)

| Criterio | Hallazgo | Evidencia de la llamada |
|----------|----------|------------------------|
| Budget | ¿Se habló de presupuesto? ¿Cifras? | Cita o referencia |
| Authority | ¿Quién decide? ¿Quién más participa? | Cita o referencia |
| Need | ¿Cuál es el problema real? ¿Urgencia? | Cita o referencia |
| Timeline | ¿Hay fechas? ¿Plazos internos? | Cita o referencia |

### 3. Framework CDW (Challenges-Duration-Why Now)

- **Challenges:** ¿Qué problemas específicos mencionó el prospecto? No lo que tú asumes, sino lo que él dijo con sus palabras.
- **Duration:** ¿Cuánto tiempo llevan con ese problema? Si la duración es larga (meses, años), ¿por qué han convivido con ello?
- **Why Now:** ¿Qué ha cambiado para que busquen solución ahora? Este es el dato más valioso de la llamada.

### 4. Señales de compra

Frases, preguntas o momentos que indican interés real. Buscar: preguntas sobre implementación, sobre precios, sobre casos similares, sobre plazos. Todo lo que indique que el prospecto se imagina usando el producto.

### 5. Señales de riesgo

Objeciones planteadas (explícitas e implícitas). Clasificar cada una como estado actual o estado futuro. Momentos donde perdió interés o cambió de tema. Información que faltó obtener.

### 6. Próximos pasos

- Lo que se comprometió cada parte (compromisos concretos, no vagos)
- Fecha específica del siguiente contacto
- Lo que hay que preparar antes del próximo paso
- Otras personas que hay que involucrar

### 7. Email de seguimiento (borrador listo para enviar)

Basado en la conversación, un email que:

- Resuma los 2-3 puntos clave (no 10 — los 2-3 que importan)
- Confirme los compromisos acordados
- Proponga fecha y formato concretos para el siguiente paso
- Tono natural y profesional, coherente con las reglas de estilo del usuario si las hay

## Reglas

- Si el input son notas caóticas, reestructúralas sin inventar nada.
- Si falta información crítica (presupuesto, timeline, decisor), señálalo claramente como "No mencionado — obtener en el próximo contacto".
- El email de seguimiento debe poder enviarse tal cual, sin retoques.

## Workflow

1. Lee el input completo antes de estructurar. No resumas sobre la marcha.
2. Genera los 7 bloques en orden.
3. En BANT y en señales, cita o referencia la llamada — no inventes evidencia.
4. Marca explícitamente lo que falte como "No mencionado".
5. Revisa que el email del bloque 7 sea enviable sin retoques.
