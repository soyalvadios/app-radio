---
name: expo-safe
description: Guardia de Expo SDK 54 para evitar migraciones, permisos peligrosos, dependencias innecesarias y cambios grandes.
compatibility: opencode
---

# Expo Safe

Reglas:
- No migrar Expo SDK.
- No cambiar React Native mayor.
- No agregar RECORD_AUDIO.
- No agregar permisos Android innecesarios.
- No instalar dependencias grandes sin explicar.
- No ejecutar npm audit fix --force.
- Background playback debe mantenerse.
- EAS APK debe seguir funcionando.

Antes de cambiar:
1. Revisar package.json.
2. Revisar app.json/app.config/eas.json.
3. Revisar permisos Android.
4. Cambiar solo lo pedido.
5. npm run typecheck.
