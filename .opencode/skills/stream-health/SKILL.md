---
name: stream-health
description: Audita URLs de streaming sin romper catálogo. Detecta streams caídos, redirects, formatos AAC/MP3/HLS y posibles reemplazos.
compatibility: opencode
---

# Stream Health

Objetivo:
Verificar streams del catálogo.

Reglas:
- No borrar estaciones automáticamente.
- No reemplazar streamUrl sin evidencia.
- HEAD puede fallar en radio streams; usar GET corto cuando haga falta.
- Timeout corto.
- Reportar:
  - OK
  - Redirect
  - Timeout
  - 403/404
  - Formato probable
  - Requiere reemplazo

Comandos útiles:
- npm run typecheck
- node scripts/check-streams.js si existe
- Si no existe, proponer script pequeño antes de crearlo.

Salida:
- Resumen corto.
- Top streams rotos.
- Cambios mínimos sugeridos.
