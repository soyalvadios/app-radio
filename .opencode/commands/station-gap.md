---
description: Reportar estaciones importantes faltantes por frecuencia/nombre.
agent: build
---

Usa skills:
- nopales-context
- catalog-expansion
- stream-health

Tarea:
Buscar huecos del catálogo por frecuencia, nombre y estación.

Entrada:
$ARGUMENTS

Reglas:
- No editar si no hay stream verificado.
- Reportar candidatos.
- Proponer lote pequeño.
