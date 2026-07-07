---
name: catalog-expansion
description: Expande y corrige el catálogo de estaciones mexicanas con cambios pequeños, estructura compatible y búsqueda por nombre, frecuencia, alias, ciudad, estado y género.
compatibility: opencode
---

# Catalog Expansion

Objetivo:
Mejorar stations_parsed.json sin romper app.

Reglas:
- Leer estructura actual antes de editar.
- Mantener campos existentes.
- No inventar streams.
- Agregar estaciones en lotes pequeños.
- Preferir fuentes oficiales de emisoras.
- Si stream no está verificado, marcar pendiente y NO agregar como funcional.
- Frecuencia null/0 debe mostrarse Online.
- Buscar debe encontrar:
  - frecuencia: "88.1"
  - nombre: "Universal"
  - alias: "Stereo"
  - ciudad/estado
  - género

Checklist:
1. Revisar schema real.
2. Detectar duplicados por streamUrl/nombre/frecuencia.
3. Agregar aliases si el schema permite.
4. Validar JSON.
5. npm run typecheck.
6. Probar búsqueda en emulador.
