// src/hooks/useRadioPlayer.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
} from 'expo-audio';

import { useNetworkStatus } from './useNetworkStatus';
import { FmRadio } from '../services/RadioHardwareInterface';
import { PlayerStatus, type PlayerState, type RadioStation } from '../types';

interface UseRadioPlayerOptions {
  /** Reanudar automáticamente al recuperar internet. Default: true. */
  autoResumeOnReconnect?: boolean;
}

interface UseRadioPlayerReturn extends PlayerState {
  play: (station: RadioStation) => Promise<void>;
  togglePlay: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  volume: number;
  setVolume: (value: number) => void;
  sleepTimerMinutes: number;
  setSleepTimer: (minutes: number) => void;
}

/**
 * Motor único del reproductor de radio.
 *
 * IMPORTANTE: monta este hook UNA sola vez (en un RadioPlayerProvider en la
 * raíz) y consume su valor por contexto. Si lo invocas en varias pantallas
 * crearás varios players y se solaparán los audios.
 */
export function useRadioPlayer(
  options: UseRadioPlayerOptions = {},
): UseRadioPlayerReturn {
  const { autoResumeOnReconnect = true } = options;

  // Un solo player para toda la app: se crea vacío y se cambia de estación
  // con player.replace({ uri }).
  const player = useAudioPlayer(null);
  const audioStatus = useAudioPlayerStatus(player);
  const network = useNetworkStatus();

  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [volume, setVolume] = useState(1.0);

  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(0);
  const sleepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sleepCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs para leer valores frescos dentro de efectos sin recrearlos.
  const playingRef = useRef(false);
  const userWantsPlayback = useRef(false);        // intención real del usuario
  const wasPlayingBeforeOffline = useRef(false);  // para el auto-resume

  useEffect(() => {
    playingRef.current = audioStatus.playing;
  }, [audioStatus.playing]);

  // 1) Sesión de audio: silencio + segundo plano + no mezclar con otras apps.
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    }).catch((e) => console.warn('[audio] setAudioModeAsync', e));
  }, []);

  // Cleanup sleep timers on unmount
  useEffect(() => {
    return () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
      if (sleepCountdownRef.current) clearInterval(sleepCountdownRef.current);
    };
  }, []);

  // 2) Reacción a la red: cortar el stream al caer offline; reanudar al volver.
  useEffect(() => {
    if (network.isOffline) {
      if (playingRef.current) {
        wasPlayingBeforeOffline.current = true;
        player.pause();
        Alert.alert(
          'Sin conexión',
          'Se perdió el internet. El streaming se pausó (Modo Offline).',
        );
      }
    } else if (
      autoResumeOnReconnect &&
      wasPlayingBeforeOffline.current &&
      userWantsPlayback.current &&
      currentStation
    ) {
      wasPlayingBeforeOffline.current = false;
      player.play();
    }
  }, [network.isOffline, autoResumeOnReconnect, currentStation, player]);

  // 3) PlayerStatus derivado de audio + red + intención + error (single source).
  const status: PlayerStatus = (() => {
    if (errorMessage) return PlayerStatus.ERROR;
    if (!currentStation) return PlayerStatus.IDLE;
    if (network.isOffline) return PlayerStatus.OFFLINE;
    if (!audioStatus.isLoaded) return PlayerStatus.LOADING;
    if (audioStatus.playing) {
      return audioStatus.isBuffering ? PlayerStatus.BUFFERING : PlayerStatus.PLAYING;
    }
    return PlayerStatus.PAUSED;
  })();

  const play = useCallback(
    async (station: RadioStation) => {
      try {
        setErrorMessage(null);
        userWantsPlayback.current = true;

        // Sin internet no hay stream: marcamos offline y avisamos.
        if (network.isOffline) {
          setCurrentStation(station);
          Alert.alert(
            'Modo Offline',
            'No hay conexión a internet para reproducir el streaming.',
          );
          return;
        }

        // (Futuro) ruta por hardware FM antes del streaming.
        if (FmRadio.isHardwareAvailable()) {
          await FmRadio.turnOnRadioHorizontal();
          await FmRadio.setFrequency(station.frequency);
          setCurrentStation(station);
          return;
        }

        // Cambiar de estación = reemplazar la fuente del player.
        if (currentStation?.id !== station.id) {
          player.replace({ uri: station.streamUrl });
          setCurrentStation(station);
        }

        // Controles en lock screen / segundo plano (Android los requiere para
        // sostener la reproducción más allá de ~3 min).
        player.setActiveForLockScreen?.(true, {
          title: station.name,
          artist: `${station.frequency} ${station.band} · ${station.state}`,
          artworkUrl: station.logo,
        });

        player.play();
      } catch (e) {
        console.error('[audio] play error', e);
        setErrorMessage('No se pudo reproducir la estación.');
      }
    },
    [player, network.isOffline, currentStation],
  );

  const pause = useCallback(() => {
    userWantsPlayback.current = false;
    player.pause();
  }, [player]);

  const togglePlay = useCallback(async () => {
    if (!currentStation) return;
    if (audioStatus.playing) pause();
    else await play(currentStation);
  }, [audioStatus.playing, currentStation, pause, play]);

  const stop = useCallback(() => {
    userWantsPlayback.current = false;
    wasPlayingBeforeOffline.current = false;
    player.pause();
    player.setActiveForLockScreen?.(false);
    setCurrentStation(null);
    setErrorMessage(null);
  }, [player]);

  const handleSetVolume = useCallback(
    (value: number) => {
      const clamped = Math.max(0, Math.min(1, value));
      setVolume(clamped);
      player.volume = clamped;
    },
    [player],
  );

  const setSleepTimer = useCallback(
    (minutes: number) => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
      if (sleepCountdownRef.current) clearInterval(sleepCountdownRef.current);

      if (minutes <= 0) {
        setSleepTimerMinutes(0);
        return;
      }

      setSleepTimerMinutes(minutes);

      sleepCountdownRef.current = setInterval(() => {
        setSleepTimerMinutes((prev) => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 60_000);

      sleepTimerRef.current = setTimeout(() => {
        if (sleepCountdownRef.current) clearInterval(sleepCountdownRef.current);
        setSleepTimerMinutes(0);
        player.pause();
      }, minutes * 60_000);
    },
    [player],
  );

  return {
    status,
    currentStation,
    isOffline: network.isOffline,
    errorMessage,
    play,
    togglePlay,
    pause,
    stop,
    volume,
    setVolume: handleSetVolume,
    sleepTimerMinutes,
    setSleepTimer,
  };
}
