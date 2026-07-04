// src/theme/layout.ts

/**
 * Altura base de la tab bar SIN contar el safe-area inferior.
 * Se comparte entre:
 *   - app/(tabs)/_layout.tsx  → alto real de la barra (= base + insets.bottom)
 *   - app/_layout.tsx         → posición del MiniPlayer (para flotar sobre ella)
 * Mantenerla en un solo lugar evita que se desincronicen.
 */
export const TAB_BAR_HEIGHT = 58;

/** Alto aproximado del MiniPlayer; útil para paddings de listas. */
export const MINI_PLAYER_HEIGHT = 68;
