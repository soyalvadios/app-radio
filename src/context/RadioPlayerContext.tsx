// src/context/RadioPlayerContext.tsx
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useRadioPlayer } from '../hooks/useRadioPlayer';
import type { PlayerState, RadioStation } from '../types';

/**
 * Valor expuesto: el estado del reproductor (PlayerState) + los controles,
 * con los nombres que pide la UI (playStation / togglePlayback).
 */
interface RadioPlayerContextValue extends PlayerState {
  playStation: (station: RadioStation) => Promise<void>;
  pause: () => void;
  togglePlayback: () => Promise<void>;
  stop: () => void;
  volume: number;
  setVolume: (value: number) => void;
  sleepTimerMinutes: number;
  setSleepTimer: (minutes: number) => void;
}

const RadioPlayerContext = createContext<RadioPlayerContextValue | null>(null);

/**
 * Provider global. Monta `useRadioPlayer` UNA sola vez, garantizando una única
 * instancia del player de expo-audio para toda la app. Envuélvelo en la raíz:
 *
 *   <RadioPlayerProvider>
 *     <AppNavigator />
 *   </RadioPlayerProvider>
 */
export function RadioPlayerProvider({ children }: { children: ReactNode }) {
  const player = useRadioPlayer();

  // Las funciones (play/pause/...) ya son estables (useCallback en el hook),
  // así que el value solo cambia cuando cambia el estado del reproductor.
  const value = useMemo<RadioPlayerContextValue>(
    () => ({
      status: player.status,
      currentStation: player.currentStation,
      isOffline: player.isOffline,
      errorMessage: player.errorMessage,
      playStation: player.play,
      pause: player.pause,
      togglePlayback: player.togglePlay,
      stop: player.stop,
      volume: player.volume,
      setVolume: player.setVolume,
      sleepTimerMinutes: player.sleepTimerMinutes,
      setSleepTimer: player.setSleepTimer,
    }),
    [
      player.status,
      player.currentStation,
      player.isOffline,
      player.errorMessage,
      player.play,
      player.pause,
      player.togglePlay,
      player.stop,
      player.volume,
      player.setVolume,
      player.sleepTimerMinutes,
      player.setSleepTimer,
    ],
  );

  return (
    <RadioPlayerContext.Provider value={value}>
      {children}
    </RadioPlayerContext.Provider>
  );
}

/** Consumidor con invariante: falla claro si se usa fuera del provider. */
export function useRadioPlayerContext(): RadioPlayerContextValue {
  const ctx = useContext(RadioPlayerContext);
  if (ctx == null) {
    throw new Error(
      'useRadioPlayerContext debe usarse dentro de <RadioPlayerProvider>.',
    );
  }
  return ctx;
}
