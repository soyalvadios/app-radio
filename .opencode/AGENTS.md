# Nopales Radio — OpenCode Project Rules

Modo David:
- Español.
- Corto.
- /caveman = directo.
- /ponytail = mínimo cambio seguro.
- Comandos exactos.
- No sobreingeniería.

Proyecto:
- Expo SDK ~54.
- React Native + expo-router.
- expo-audio.
- AsyncStorage.
- NetInfo.
- EAS Build Android APK.
- Catálogo offline-first desde stations_parsed.json.

Reglas duras:
- NO migrar Expo SDK.
- NO crear backend.
- NO crear auth.
- NO ejecutar npm audit fix --force.
- NO implementar FM hardware real.
- NO agregar RECORD_AUDIO.
- NO duplicar useRadioPlayer.
- NO duplicar RadioPlayerContext.
- CatalogProvider es fuente compartida de catálogo/favoritos.
- Sintonización por frecuencia = streaming del catálogo.
- IDs de estaciones derivados de streamUrl/hash estable; no asumir s1/s2/s3.
- Cambios pequeños.
- Typecheck antes de commit.

Prioridad actual:
1. Mejorar catálogo nacional y estaciones faltantes.
2. Validar streams.
3. Pulir bugs visuales.
4. Generar APK.
5. Release v1.0.1 si el último commit no está en v1.0.0.
