---
name: release-apk
description: Checklist seguro para APK Android con EAS, tags v1.0.x, typecheck y release notes cortas.
compatibility: opencode
---

# Release APK

Objetivo:
Preparar APK final.

Reglas:
- Build APK, no AAB salvo que se pida.
- No cambiar versión sin confirmar.
- Si v1.0.0 fue antes del último commit, recomendar v1.0.1.
- No tocar código durante release salvo bug crítico.

Checklist:
1. git status
2. git log -5 --oneline
3. git tag --contains HEAD
4. npm run typecheck
5. revisar eas.json
6. comando build:
   npx eas-cli build -p android --profile preview
   o production si ese perfil genera APK
7. release notes cortas.
