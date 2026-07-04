// src/components/MiniPlayer.tsx
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Pause, Play, Square, Volume1, Volume2, WifiOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useRadioPlayerContext } from '../context/RadioPlayerContext';
import { PlayerStatus, type RadioStation } from '../types';

function formatFrequency(station: RadioStation): string {
  const freq = station.band === 'FM' ? station.frequency.toFixed(1) : String(Math.round(station.frequency));
  return `${freq} ${station.band}`;
}

interface MiniPlayerProps {
  bottomOffset?: number;
}

export function MiniPlayer({ bottomOffset = 16 }: MiniPlayerProps) {
  const router = useRouter();
  const { currentStation, status, isOffline, togglePlayback, stop, volume, setVolume } = useRadioPlayerContext();

  if (currentStation == null) return null;

  const isPlaying = status === PlayerStatus.PLAYING;
  const isLoading = status === PlayerStatus.LOADING || status === PlayerStatus.BUFFERING;
  const showOffline = isOffline || status === PlayerStatus.OFFLINE;

  let statusText = '';
  if (isPlaying) statusText = 'Reproduciendo';
  else if (status === PlayerStatus.PAUSED) statusText = 'Pausado';
  else if (status === PlayerStatus.ERROR) statusText = 'Error';

  return (
    <Pressable
      onPress={() => router.push('/player')}
      style={[styles.pill, { bottom: bottomOffset }]}
    >
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {currentStation.name}
        </Text>
        <View style={styles.subRow}>
          {showOffline ? (
            <>
              <WifiOff size={13} color="#F5A623" />
              <Text style={[styles.sub, { color: '#F5A623' }]} numberOfLines={1}>
                Sin conexión
              </Text>
            </>
          ) : (
            <Text style={styles.sub} numberOfLines={1}>
              {formatFrequency(currentStation)} · {statusText}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={() => setVolume(volume - 0.1)}
          style={styles.volBtn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Bajar volumen"
        >
          <Volume1 size={16} color="#8E8E93" />
        </Pressable>

        {isLoading ? (
          <View style={styles.playBtn}>
            <ActivityIndicator color="#1F3B5C" size="small" />
          </View>
        ) : (
          <Pressable
            onPress={togglePlayback}
            disabled={showOffline}
            style={[styles.playBtn, showOffline && styles.btnDisabled]}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? (
              <Pause size={20} color="#1F3B5C" fill="#1F3B5C" />
            ) : (
              <Play size={20} color="#1F3B5C" fill="#1F3B5C" style={{ marginLeft: 2 }} />
            )}
          </Pressable>
        )}

        <Pressable
          onPress={stop}
          style={styles.stopBtn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Detener"
        >
          <Square size={16} color="#8E8E93" fill="#8E8E93" />
        </Pressable>

        <Pressable
          onPress={() => setVolume(volume + 0.1)}
          style={styles.volBtn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Subir volumen"
        >
          <Volume2 size={16} color="#8E8E93" />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 24,
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.2,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  sub: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.4,
  },
});
