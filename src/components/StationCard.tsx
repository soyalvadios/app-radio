// src/components/StationCard.tsx
import { memo, useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Music, Radio, Star } from 'lucide-react-native';
import { useRadioPlayerContext } from '../context/RadioPlayerContext';
import { PlayerStatus, type RadioStation } from '../types';

const COLORS = {
  accent: '#1F3B5C',
  star: '#F5A623',
  live: '#2E9E5B',
  textMuted: '#8E8E93',
};

function formatStationFrequency(station: RadioStation): string {
  if (!station.frequency || station.frequency === 0) return 'Online';
  const freq = station.band === 'FM' ? station.frequency.toFixed(1) : String(Math.round(station.frequency));
  return `${freq} ${station.band}`;
}

interface StationCardProps {
  station: RadioStation;
  isFavorite: boolean;
  onToggleFavorite: (stationId: string) => void;
}

function StationCardBase({ station, isFavorite, onToggleFavorite }: StationCardProps) {
  const { currentStation, status, playStation } = useRadioPlayerContext();
  const [imageError, setImageError] = useState(false);

  const isActive = currentStation?.id === station.id;
  const isPlaying = isActive && status === PlayerStatus.PLAYING;

  const handlePress = useCallback(() => {
    playStation(station);
  }, [playStation, station]);

  const handleStar = useCallback(() => {
    onToggleFavorite(station.id);
  }, [onToggleFavorite, station.id]);

  let activityLabel: string | null = null;
  if (isActive) {
    if (status === PlayerStatus.OFFLINE) activityLabel = 'Sin conexión';
    else if (status === PlayerStatus.LOADING || status === PlayerStatus.BUFFERING) activityLabel = 'Cargando…';
    else if (status === PlayerStatus.PLAYING) activityLabel = 'Reproduciendo';
    else activityLabel = 'Pausado';
  }

  const hasLogo = station.logo && !imageError;

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Reproducir ${station.name}`}
      style={({ pressed }) => [
        styles.card,
        isActive && styles.cardActive,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.logoWrap}>
        {hasLogo ? (
          <Image
            source={{ uri: station.logo }}
            style={styles.logoImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <Radio size={22} color={COLORS.accent} />
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {station.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {formatStationFrequency(station)} · {station.state}
          </Text>

          {activityLabel != null && (
            <View style={styles.liveRow}>
              <View
                style={[styles.liveDot, { backgroundColor: isPlaying ? COLORS.live : COLORS.textMuted }]}
              />
              <Text style={[styles.liveText, { color: isPlaying ? COLORS.live : COLORS.textMuted }]}>
                {activityLabel}
              </Text>
            </View>
          )}
        </View>

        <Pressable
          onPress={handleStar}
          hitSlop={10}
          style={styles.starBtn}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Star size={22} color={COLORS.star} fill={isFavorite ? COLORS.star : 'transparent'} />
        </Pressable>
      </View>
    </Pressable>
  );
}

export const StationCard = memo(StationCardBase);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cardActive: {
    backgroundColor: '#F2F2F7',
  },
  cardPressed: {
    opacity: 0.5,
  },
  logoWrap: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.3,
  },
  meta: {
    marginTop: 4,
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
  },
  starBtn: {
    padding: 4,
  },
});
