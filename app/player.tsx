import { Alert, Image, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCallback, useRef, useState } from 'react';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setAudioModeAsync } from 'expo-audio';
import { Cast, ChevronDown, Moon, Pause, Play, Radio, Square, Volume1, VolumeX } from 'lucide-react-native';

import { useRadioPlayerContext } from '../src/context/RadioPlayerContext';
import { PlayerStatus } from '../src/types';

function formatFrequency(freq: number, band: string): string {
  if (!freq || freq === 0) return 'Online';
  const f = band === 'FM' ? freq.toFixed(1) : String(Math.round(freq));
  return `${f} ${band}`;
}

export default function PlayerScreen() {
  const insets = useSafeAreaInsets();
  const [imageError, setImageError] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const sliderRef = useRef<View>(null);
  const sliderWidth = useRef(0);

  const {
    currentStation,
    status,
    isOffline,
    togglePlayback,
    stop: stopPlayback,
    volume,
    setVolume,
    sleepTimerMinutes,
    setSleepTimer,
  } = useRadioPlayerContext();

  const handleVolumeFromTap = useCallback(
    (pageX: number) => {
      sliderRef.current?.measure((_x, _y, width, _h, pageXOffset) => {
        const local = pageX - pageXOffset;
        const ratio = Math.max(0, Math.min(1, local / width));
        setVolume(Number(ratio.toFixed(3)));
      });
    },
    [setVolume],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt) => {
        handleVolumeFromTap(evt.nativeEvent.pageX);
      },
      onPanResponderMove: (evt) => {
        handleVolumeFromTap(evt.nativeEvent.pageX);
      },
      onPanResponderRelease: () => {},
    }),
  ).current;

  if (!currentStation) return null;

  const isPlaying = status === PlayerStatus.PLAYING;
  const isLoading = status === PlayerStatus.LOADING || status === PlayerStatus.BUFFERING;
  const isOff = isOffline || status === PlayerStatus.OFFLINE;
  const hasLogo = currentStation.logo && !imageError;

  const handleSleepTimer = () => {
    const label = sleepTimerMinutes > 0 ? `Sleep Timer (${sleepTimerMinutes} min)` : 'Sleep Timer';
    Alert.alert(label, 'Pausar la reproducción en:', [
      { text: '15 min', onPress: () => setSleepTimer(15) },
      { text: '30 min', onPress: () => setSleepTimer(30) },
      { text: '45 min', onPress: () => setSleepTimer(45) },
      { text: '60 min', onPress: () => setSleepTimer(60) },
      { text: 'Desactivar', onPress: () => setSleepTimer(0) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleAudioRoute = async () => {
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: 'doNotMix',
      });
      Alert.alert('Salida de audio', 'Usa el Centro de Control de iOS para seleccionar parlantes, AirPlay o audífonos Bluetooth.');
    } catch {
      Alert.alert('Salida de audio', 'La selección de ruta de audio se gestiona desde el sistema operativo.');
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Drag indicator */}
      <View style={styles.dragBar} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerBtn}
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
        >
          <ChevronDown size={26} color="#1A1A1A" />
        </Pressable>

        <View style={{ flex: 1 }} />

        {sleepTimerMinutes > 0 && (
          <Pressable onPress={handleSleepTimer} style={styles.timerBadge}>
            <Moon size={13} color="#1F3B5C" />
            <Text style={styles.timerText}>{sleepTimerMinutes} min</Text>
          </Pressable>
        )}
      </View>

      {/* Artwork */}
      <View style={styles.artworkContainer}>
        <View style={styles.artworkWrapper}>
          {hasLogo ? (
            <Image
              source={{ uri: currentStation.logo }}
              style={styles.artwork}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={[styles.artwork, styles.artworkFallback]}>
              <Radio size={80} color="#D1D1D6" />
            </View>
          )}
        </View>
      </View>

      {/* Metadata */}
      <View style={styles.metaSection}>
        <Text style={styles.stationName} numberOfLines={2}>
          {currentStation.name}
        </Text>
        <Text style={styles.stationFreq}>
          {formatFrequency(currentStation.frequency, currentStation.band)} · {currentStation.state}
        </Text>
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Volume slider */}
      {showVolume && (
        <View style={styles.volumeRow}>
          <Pressable onPress={() => setVolume(0)} style={styles.volIconBtn}>
            <VolumeX size={18} color="#8E8E93" />
          </Pressable>
          <View
            ref={sliderRef}
            style={styles.sliderTrack}
            onLayout={(e) => { sliderWidth.current = e.nativeEvent.layout.width; }}
            {...panResponder.panHandlers}
          >
            <View style={[styles.sliderFill, { width: `${volume * 100}%` as unknown as number }]} />
            <View style={[styles.sliderThumb, { left: `${volume * 100}%` as unknown as number }]} />
          </View>
          <Pressable onPress={() => setVolume(1)} style={styles.volIconBtn}>
            <Volume1 size={18} color="#8E8E93" />
          </Pressable>
        </View>
      )}

      {/* Main controls */}
      <View style={styles.controlsRow}>
        <Pressable
          onPress={stopPlayback}
          style={styles.ctrlBtn}
          hitSlop={16}
          accessibilityRole="button"
          accessibilityLabel="Detener"
        >
          <Square size={28} color="#1A1A1A" fill="#1A1A1A" />
        </Pressable>

        <Pressable
          onPress={togglePlayback}
          disabled={isOff}
          style={[styles.playBtn, isOff && styles.btnDisabled]}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isLoading ? (
            <Text style={styles.playLoading}>···</Text>
          ) : isPlaying ? (
            <Pause size={64} color="#1F3B5C" fill="#1F3B5C" />
          ) : (
            <Play size={64} color="#1F3B5C" fill="#1F3B5C" style={{ marginLeft: 6 }} />
          )}
        </Pressable>

        <Pressable
          onPress={() => setShowVolume(!showVolume)}
          style={styles.ctrlBtn}
          hitSlop={16}
          accessibilityRole="button"
          accessibilityLabel="Volumen"
        >
          <Volume1 size={28} color={showVolume ? '#1F3B5C' : '#1A1A1A'} />
        </Pressable>
      </View>

      {/* Bottom row: sleep timer + audio route */}
      <View style={styles.bottomRow}>
        <Pressable
          onPress={handleSleepTimer}
          style={styles.actionBtn}
          accessibilityRole="button"
          accessibilityLabel="Sleep timer"
        >
          <Moon size={20} color="#8E8E93" />
          {sleepTimerMinutes > 0 && (
            <Text style={styles.actionLabel}>{sleepTimerMinutes}m</Text>
          )}
        </Pressable>

        <Pressable
          onPress={handleAudioRoute}
          style={styles.actionBtn}
          accessibilityRole="button"
          accessibilityLabel="Salida de audio"
        >
          <Cast size={20} color="#8E8E93" />
        </Pressable>
      </View>

      <View style={{ height: insets.bottom + 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  dragBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E5EA',
    alignSelf: 'center',
    marginTop: 12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  headerBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
  },
  timerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F3B5C',
  },
  artworkContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  artworkWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 14,
  },
  artwork: {
    width: 320,
    height: 320,
    borderRadius: 8,
  },
  artworkFallback: {
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaSection: {
    paddingHorizontal: 32,
    paddingTop: 28,
  },
  stationName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  stationFreq: {
    marginTop: 6,
    fontSize: 15,
    color: '#666666',
    fontWeight: '400',
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 16,
    gap: 10,
  },
  volIconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
  },
  sliderFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1F3B5C',
    position: 'absolute',
    left: 0,
  },
  sliderThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F3B5C',
    position: 'absolute',
    marginLeft: -9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingBottom: 12,
  },
  playBtn: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playLoading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F3B5C',
    letterSpacing: 4,
  },
  ctrlBtn: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    paddingBottom: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F3B5C',
  },
  btnDisabled: {
    opacity: 0.35,
  },
});
