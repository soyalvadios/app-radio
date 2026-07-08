# Auditoría de calidad de streams — Nopales Radio

Fecha: 2026-07-07. Catálogo: 58 estaciones (CATALOG_VERSION 6).
Método: `curl.exe -L --max-time 10-15 -o NUL -w "%{http_code} %{content_type}"` contra cada `url_resolved`/`url`.

## Acciones tomadas

| Estación | URL | Problema | Acción |
|---|---|---|---|
| El Fonógrafo | `18313.live.streamtheworld.com:443/XEJP_AMAAC.aac` | `url_resolved` apuntaba a edge server caído (403 text/html) | Reemplazado por `playerservices.streamtheworld.com/api/livestream-redirect/XEJP_AMAAC.aac` (mismo dominio, redirect genérico, verificado 200 audio/aacp) |
| Heraldo Radio HD2 (dup) | `stream.radiojar.com/4bgpz3xpwhcwv` | 404, duplicado muerto de "El Heraldo Radio HD2" (que sí funciona) | Eliminada del catálogo |
| Heraldo Radio 98.5 (dup) | `stream.radiojar.com/0pqyt47etbkvv` | 404, duplicado muerto de "El Heraldo Radio 98.5" (que sí funciona) | Eliminada del catálogo |
| Imagen Radio 90.5 (dup) | `.../XEDAFMAAC.aac` | 404 (text/html), duplicado muerto de la versión mdstrm (que sí funciona) | Eliminada del catálogo |

Total: 61 → 58 estaciones (3 duplicados muertos fuera, 0 estaciones únicas perdidas).

## Streams que siguen mal (sin URL alternativa verificada)

| Estación | URL actual | Bitrate | Codec | Content-Type | Estado | Motivo |
|---|---|---|---|---|---|---|
| Frecuencia 106.9 | `5c001c2729b09.streamlock.net:4443/...` | 192 | MP3 | — (timeout TCP) | **incorrecta** | Conexión no abre (timeout 15s en el `connect`, no es problema de HTTP). Radio comunitaria pequeña (Xochimilco), probablemente offline. No hay URL alterna en el registro ni en `homepage` que sea un stream directo (regla: no usar homepage como stream). Sin acción — documentado. |
| La Bestia Grupera 540 | `sg.centrocibernetico.com/audiorama-xewf` | 23 | AAC+ | audio/aacp (200) | **baja calidad** | Bitrate real muy bajo incluso para HE-AAC (23kbps ≈ voz AM). Stream responde, no está muerto. Sin alternativa mejor conocida — sin acción. |

## Streams con bitrate declarado bajo (32/48kbps AAC+) — verificados OK

~30 estaciones (mayoría Grupo ACIR / iHeartRadio vía streamtheworld) declaran 32-48kbps AAC+ (HE-AAC). Todas responden 200 con `content-type: audio/aacp`. HE-AAC a 48kbps es el estándar de estas radiodifusoras (comparable a ~96-128kbps MP3 en percepción) — **no es un bug**, es el formato real que transmiten. No se tocaron.

## Streams con bitrate=0 — verificados OK

Arroba FM, El Heraldo Radio HD2, El Heraldo Radio 98.5, Radio 620 (zeno.fm / radiojar): bitrate 0 es metadata faltante del proveedor, no indica falla. Las 4 responden 200 `audio/mpeg`. No se tocaron.

## Resumen

- Estaciones auditadas: 58/58
- Streams funcionando: 57
- Streams muertos sin reemplazo: 1 (Frecuencia 106.9)
- Streams corregidos: 1 (El Fonógrafo)
- Duplicados muertos eliminados: 3
