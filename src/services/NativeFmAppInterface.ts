// src/services/NativeFmAppInterface.ts
//
// Contrato Fase 1 de "FM del teléfono": NO controla chip FM (ver
// docs/FM_HARDWARE_RESEARCH.md). Solo detecta/abre la app FM nativa del
// fabricante vía Intent. Distinto del contrato de chip en
// RadioHardwareInterface.ts (usado por useRadioPlayer) — no tocar ese.

export type HardwareStatus =
  | 'AVAILABLE_VIA_INTENT'
  | 'UNSUPPORTED_OS'
  | 'NO_COMPATIBLE_APP'
  | 'UNKNOWN';

export interface NativeFmApp {
  packageName: string;
  appName: string;
  isInstalled: boolean;
}

export interface RadioHardwareInterface {
  isHardwareAvailable(): Promise<boolean>;
  scanNativeFmApps(): Promise<NativeFmApp[]>;
  openNativeFmApp(packageName?: string): Promise<boolean>;
  tuneFrequency(freq: number): Promise<boolean>;
  getHardwareStatus(): Promise<HardwareStatus>;
  getUnsupportedReason(): string | null;
}
