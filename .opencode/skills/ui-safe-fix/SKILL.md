---
name: ui-safe-fix
description: Corrige bugs visuales en React Native con cambios mínimos, sin tocar lógica de audio ni arquitectura.
compatibility: opencode
---

# UI Safe Fix

Objetivo:
Arreglar UI sin romper player.

Reglas:
- No tocar lógica de audio.
- No duplicar MiniPlayer.
- No duplicar contextos.
- No refactor grande.
- Evitar cambios globales.
- Mantener safe-area.
- Verificar que MiniPlayer no tape listas ni pantalla player.
- Probar Android emulador.

Checklist:
1. Ubicar componente exacto.
2. Cambiar estilos/ruta mínima.
3. npm run typecheck.
4. Explicar archivos tocados.
