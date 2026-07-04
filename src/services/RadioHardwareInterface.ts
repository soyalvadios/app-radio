// src/services/RadioHardwareInterface.ts

/**
 * Contrato para un módulo nativo de radio FM por hardware (futuro).
 *
 * Los teléfonos modernos restringen el acceso al chip FM, así que HOY usamos
 * una implementación Null Object (no-op) que reporta "no disponible" y deja
 * que el orquestador del reproductor caiga al flujo de streaming / offline.
 *
 * El día que exista un módulo nativo (Android JNI/Java) que exponga el chip,
 * se implementa esta misma interfaz y se registra con `registerRadioHardware()`.
 * El resto de la app no cambia una sola línea.
 */
export interface RadioHardwareInterface {
  /** ¿Hay chip FM accesible en este dispositivo/build? */
  isHardwareAvailable(): boolean;

  /**
   * Enciende la radio FM por hardware. (Nombre conservado del contrato
   * original: `turnOnRadioHorizontal`.) En muchos chips requiere audífonos
   * conectados, que actúan como antena.
   */
  turnOnRadioHorizontal(): Promise<void>;

  /** Sintoniza una frecuencia en MHz (p.ej. 96.9). */
  setFrequency(freq: number): Promise<void>;

  /** Apaga el chip y libera el recurso de audio. */
  turnOff(): Promise<void>;
}

/**
 * Implementación por defecto (Null Object): no hay hardware. Nunca lanza:
 * informa indisponibilidad para que el reproductor decida streaming u offline.
 */
class UnavailableFmHardware implements RadioHardwareInterface {
  isHardwareAvailable(): boolean {
    return false;
  }
  async turnOnRadioHorizontal(): Promise<void> {
    console.warn('[FM] Hardware no disponible: usando streaming/fallback.');
  }
  async setFrequency(_freq: number): Promise<void> {
    /* no-op */
  }
  async turnOff(): Promise<void> {
    /* no-op */
  }
}

// Singleton de la implementación activa (inyectable para tests / build nativo).
let activeHardware: RadioHardwareInterface = new UnavailableFmHardware();

/** Punto único de acceso al hardware FM activo. */
export function getRadioHardware(): RadioHardwareInterface {
  return activeHardware;
}

/**
 * Registra la implementación real cuando exista el módulo nativo, p.ej.:
 *   if (Platform.OS === 'android' && NativeModules.FmRadio) {
 *     registerRadioHardware(new AndroidFmHardware());
 *   }
 */
export function registerRadioHardware(impl: RadioHardwareInterface): void {
  activeHardware = impl;
}

/**
 * Fachada estática, tal como se pidió: permite llamar sin instanciar nada
 *   FmRadio.isHardwareAvailable()
 *   FmRadio.setFrequency(96.9)
 * delegando siempre en la implementación activa.
 */
export const FmRadio = {
  isHardwareAvailable: (): boolean => getRadioHardware().isHardwareAvailable(),
  turnOnRadioHorizontal: (): Promise<void> => getRadioHardware().turnOnRadioHorizontal(),
  setFrequency: (freq: number): Promise<void> => getRadioHardware().setFrequency(freq),
  turnOff: (): Promise<void> => getRadioHardware().turnOff(),
} as const;
