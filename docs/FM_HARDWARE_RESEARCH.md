# Investigación FM Hardware — Nopales Radio

## Conclusión

Streaming sigue siendo el modo principal de la app. No cambia.

FM hardware directo (controlar el chip FM del teléfono) **no es viable** hoy:

- **Android estándar**: el chip FM (si existe) está detrás de permisos `system`/`signature`. Apps de terceros no pueden abrirlo sin firma del fabricante o root.
- **iOS**: no expone API pública de chip FM. No soportado, punto.
- **Root / ROM de fabricante**: técnicamente posible pero fuera de alcance — no aplica a usuarios normales, no lo soporta Nopales.
- **SDR (USB dongle)**: queda como laboratorio/futuro lejano. Requiere hardware externo, no es "FM del teléfono".

## Fase actual (Fase 1)

Botón experimental: abrir la app FM nativa del fabricante (Samsung, Xiaomi, Motorola, etc.) vía Android Intent, **si existe en el dispositivo**.

Nopales **no promete sintonizar frecuencia** desde su propia UI. Solo abre la app nativa; el usuario sintoniza ahí.

## Fase 2 (no implementada, solo documentada)

Para detectar/abrir apps nativas de verdad hace falta:

- `expo-intent-launcher` (dependencia nueva, no instalada aún)
- Config Plugin con `<queries>` en `AndroidManifest.xml` (package visibility, Android 11+)
- Development build / EAS (ya no sirve Expo Go puro)

Sin esto, Fase 1 solo puede reportar estado `UNKNOWN` o `NO_COMPATIBLE_APP` de forma segura — no puede confirmar instalación real.
