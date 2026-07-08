// src/types.ts

/**
 * Estados de la República Mexicana (32).
 * Se exporta como tupla `as const` para derivar el union type `MexicanState`,
 * forzando consistencia en el catálogo y habilitando el filtro por estado
 * sin strings mágicos repartidos por la app.
 */
export const MEXICAN_STATES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
  'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo',
  'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
  'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
  'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz',
  'Yucatán', 'Zacatecas',
] as const;

export type MexicanState = (typeof MEXICAN_STATES)[number];

export type RadioBand = 'FM' | 'AM';

/**
 * Modelo central del catálogo. Es lo que el backend (Python/Node) devuelve
 * en el JSON y lo que se persiste localmente (AsyncStorage/SQLite) para que
 * búsqueda y filtros funcionen 100% offline.
 */
export interface RadioStation {
  id: string;
  name: string;
  frequency: number;        // p.ej. 96.9
  band: RadioBand;          // FM | AM
  streamUrl: string;        // URL de streaming (HLS / Icecast / SHOUTcast)
  state: MexicanState;      // estado de la República (filtro)
  city?: string;
  logo: string;             // URL del logo (cacheable)
  genre?: string;
  tags: string[];           // etiquetas limpias del catálogo (categorías + género + frecuencia)
}

/**
 * Máquina de estados del reproductor. Enum cerrado: la UI mapea 1:1 cada
 * estado a un indicador visual (incluido el "Modo Offline").
 */
export enum PlayerStatus {
  IDLE = 'IDLE',           // sin estación cargada
  LOADING = 'LOADING',     // resolviendo / cargando el stream
  BUFFERING = 'BUFFERING', // reproduciendo pero rellenando buffer
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  OFFLINE = 'OFFLINE',     // sin internet: el streaming no está disponible
  ERROR = 'ERROR',         // fallo de carga / reproducción
}

/** Snapshot que el hook expone a la UI. */
export interface PlayerState {
  status: PlayerStatus;
  currentStation: RadioStation | null;
  isOffline: boolean;
  errorMessage: string | null;
}

/** Estado de red normalizado, independiente de la librería que lo provea. */
export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;            // wifi | cellular | none | unknown ...
  isOffline: boolean;      // derivado: !isConnected || !isInternetReachable
}
