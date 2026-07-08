// src/services/NativeFmAppService.ts
//
// Implementación segura Fase 1. No detecta paquetes instalados de verdad
// (requiere expo-intent-launcher + config plugin, ver docs/FM_HARDWARE_RESEARCH.md
// — Fase 2, no instalado). Por eso Android reporta UNKNOWN y openNativeFmApp
// no promete apertura real todavía.

import { Linking, Platform } from 'react-native';
import type { HardwareStatus, NativeFmApp, RadioHardwareInterface } from './NativeFmAppInterface';

const KNOWN_FM_PACKAGES: readonly Omit<NativeFmApp, 'isInstalled'>[] = [
  { packageName: 'com.sec.android.app.fm', appName: 'Samsung FM Radio' },
  { packageName: 'com.samsung.android.app.fmradio', appName: 'Samsung FM Radio' },
  { packageName: 'com.miui.fm', appName: 'Mi Radio FM' },
  { packageName: 'com.motorola.fmplayer', appName: 'Motorola FM Radio' },
  { packageName: 'com.caf.fmradio', appName: 'FM Radio (CAF)' },
  { packageName: 'com.android.fmradio', appName: 'FM Radio (AOSP)' },
  { packageName: 'com.lge.fmradio', appName: 'LG FM Radio' },
  { packageName: 'com.sonyericsson.fmradio', appName: 'Sony FM Radio' },
];

class NativeFmAppService implements RadioHardwareInterface {
  async isHardwareAvailable(): Promise<boolean> {
    return (await this.getHardwareStatus()) === 'AVAILABLE_VIA_INTENT';
  }

  async scanNativeFmApps(): Promise<NativeFmApp[]> {
    if (Platform.OS !== 'android') return [];
    // Sin expo-intent-launcher no hay forma de confirmar instalación real
    // (package visibility, Android 11+). Se lista el catálogo conocido como
    // no instalado — Fase 2 lo reemplaza por detección real.
    return KNOWN_FM_PACKAGES.map((app) => ({ ...app, isInstalled: false }));
  }

  async openNativeFmApp(packageName?: string): Promise<boolean> {
    if (Platform.OS !== 'android' || !packageName) return false;
    try {
      // Best-effort: sin expo-intent-launcher no se puede lanzar por
      // package name de forma confiable. Se deja el intento para no romper
      // nada si en el futuro el OS/Linking lo resuelve; hoy normalmente falla.
      const opened = await Linking.canOpenURL(`package:${packageName}`);
      if (!opened) return false;
      await Linking.openURL(`package:${packageName}`);
      return true;
    } catch (err) {
      console.warn('[FM nativo] No se pudo abrir app nativa:', err);
      return false;
    }
  }

  async tuneFrequency(_freq: number): Promise<boolean> {
    // Fase 1: nunca sintoniza de verdad. Ver docs/FM_HARDWARE_RESEARCH.md.
    return false;
  }

  async getHardwareStatus(): Promise<HardwareStatus> {
    if (Platform.OS === 'ios' || Platform.OS === 'web') return 'UNSUPPORTED_OS';
    if (Platform.OS === 'android') return 'UNKNOWN';
    return 'UNSUPPORTED_OS';
  }

  getUnsupportedReason(): string | null {
    if (Platform.OS === 'ios') {
      return 'FM del teléfono no está disponible en iPhone. Usa streaming.';
    }
    if (Platform.OS === 'web') {
      return 'FM del teléfono no está disponible en web. Usa streaming.';
    }
    if (Platform.OS === 'android') {
      return 'Tu dispositivo no expone una app FM nativa compatible.';
    }
    return 'FM del teléfono no está disponible en este dispositivo.';
  }
}

export const nativeFmAppService: RadioHardwareInterface = new NativeFmAppService();
