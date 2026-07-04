# Radio App — CLAUDE.md

App Expo de radio streaming mexicana. Catalogo offline-first.

## Stack
- Expo SDK ~54 + expo-router (file-based)
- expo-audio para streaming
- AsyncStorage para persistencia
- NetInfo para estado de red

## Arquitectura
- `app/` — paginas (expo-router): index (onboarding), (tabs)/ (inicio+favs), player (modal)
- `src/context/RadioPlayerContext.tsx` — unico provider del reproductor, monta useRadioPlayer una vez
- `src/hooks/useCatalog.ts` — catalogo + filtros + favoritos (PERO cada instancia es independiente)
- `src/services/` — NetworkService, CatalogStorageService, RadioHardwareInterface (Null Object)

## Reglas
1. **Nunca duplicar useRadioPlayer**. Un solo provider en raiz. Pantallas consumen por contexto.
2. **useCatalog NO compartido** entre tabs. Si tocas favoritos/hooks/catalogo, prioriza migrar a CatalogProvider antes de agregar mas estados.
3. **stations_parsed.json** tiene 50 estaciones reales. CatalogStorageService solo usa 8 hardcodeadas. Cualquier cambio en catalogo debe integrar el JSON.
4. **Sleep timer** en useRadioPlayer: setTimeout/setInterval sin cleanup en unmount. Bug conocido.
5. **Volume slider** en player.tsx usa `as unknown as number` para porcentaje — no toques, refactor cuando haya tiempo.
6. **SDK version**: package.json dice ~54, docs referencia v56. Migrar cuando toque.

## Convenciones
- Nombres de archivo en ingles, comentarios en español
- Servicios como objetos con metodos (no clases)
- Hooks devuelven objetos planos, no arrays
- Preferir `useCallback`/`useMemo` en handlers pasados a hijos
- COLORS / estilos en el mismo archivo del componente (no temas globales)
