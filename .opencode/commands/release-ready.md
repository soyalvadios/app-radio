---
description: Preparar release notes y tag.
agent: build
---

Usa skills:
- nopales-context
- release-apk

Tarea:
Preparar release final.

No editar código.
No crear tag sin confirmar.

Revisar:
- git status
- git log -5 --oneline
- git tag --contains HEAD
- npm run typecheck

Entregar:
- versión recomendada
- release notes cortas
- comandos exactos
