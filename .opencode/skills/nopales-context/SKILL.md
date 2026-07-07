---
name: nopales-context
description: Contexto base del proyecto Nopales Radio. Úsalo antes de tocar código para respetar arquitectura, SDK, audio, catálogo y release APK.
compatibility: opencode
---

# Nopales Radio Context

App Expo SDK ~54 de radio streaming mexicana.

Stack:
- Expo SDK ~54
- expo-router
- expo-audio
- AsyncStorage
- NetInfo
- TypeScript
- EAS Build Android APK

Arquitectura:
- app/ = rutas expo-router
- app/player.tsx = pantalla full player modal
- src/context/RadioPlayerContext.tsx = único provider de audio
- src/context/CatalogContext.tsx = catálogo/favoritos compartidos
- stations_parsed.json = catálogo local/offline-first

Reglas:
- NO migrar Expo SDK.
- NO backend.
- NO auth.
- NO audit fix --force.
- NO FM hardware real.
- NO RECORD_AUDIO.
- NO duplicar useRadioPlayer.
- NO duplicar RadioPlayerContext.
- Usar CatalogProvider.
- Cambios mínimos.
- npm run typecheck siempre.
