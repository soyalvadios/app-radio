---
description: Revisar si APK está listo.
agent: build
---

Usa skills:
- nopales-context
- expo-safe
- release-apk

Tarea:
Revisar si Nopales Radio está listo para APK Android.

No editar código.

Ejecutar/verificar:
- git status
- git log -5 --oneline
- git tag --contains HEAD
- npm run typecheck
- eas.json

Entregar:
- OK para APK: sí/no
- Tag recomendado
- Comando exacto EAS
