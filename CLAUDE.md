# Radio App — CLAUDE.md

App Expo de radio streaming mexicana. Catálogo offline-first.

## Stack
- Expo SDK ~54 + expo-router (file-based)
- expo-audio para streaming
- AsyncStorage para persistencia
- NetInfo para estado de red

## Arquitectura
- `app/` — páginas (expo-router): index (onboarding), (tabs)/ (inicio+tuner+favs), player (modal)
- `src/context/RadioPlayerContext.tsx` — único provider del reproductor, monta useRadioPlayer una vez
- `src/context/CatalogContext.tsx` — CatalogProvider compartido entre tabs (catálogo + favoritos)
- `src/services/` — NetworkService, CatalogStorageService, RadioHardwareInterface (Null Object)

## Reglas
1. **Nunca duplicar useRadioPlayer**. Un solo provider en raíz. Pantallas consumen por contexto.
2. **CatalogProvider es la fuente compartida** de catálogo y favoritos. No hooks useCatalog sueltos.
3. **No migrar Expo SDK sin plan**. package.json dice ~54, docs referencia v56. Migrar cuando toque.
4. **FM hardware real no se implementa** por permisos Android y falta de soporte unificado. Sintonización por frecuencia usa streaming del catálogo.
5. **station IDs derivados de streamUrl** (hash estable). IDs tipo `s${i}` ya no existen — no asumir orden.

## Convenciones
- Nombres de archivo en inglés, comentarios en español
- Servicios como objetos con métodos (no clases)
- Hooks devuelven objetos planos, no arrays
- Preferir `useCallback`/`useMemo` en handlers pasados a hijos
- COLORS / estilos en el mismo archivo del componente (no temas globales)
