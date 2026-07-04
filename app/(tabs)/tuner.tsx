import { useCallback, useRef, useState } from 'react';
import { Dimensions, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Play, Pause, Power, Radio, Star } from 'lucide-react-native';
import { useCatalogContext } from '../../src/context/CatalogContext';
import { useRadioPlayerContext } from '../../src/context/RadioPlayerContext';
import { PlayerStatus } from '../../src/types';
import {
  FM_MIN,
  FM_MAX,
  FM_STEP,
  clampFrequency,
  findExactStationByFrequency,
  getAvailableFrequencies,
  findPrevAvailableFreq,
  findNextAvailableFreq,
} from '../../src/utils/frequency';

const SCREEN_WIDTH = Dimensions.get('window').width;
const RULER_PADDING_H = 24;
const RULER_WIDTH = SCREEN_WIDTH - RULER_PADDING_H * 2;
const FREQ_RANGE = FM_MAX - FM_MIN;
const PX_PER_MHZ = RULER_WIDTH / FREQ_RANGE;

function freqToX(freq: number): number {
  return (freq - FM_MIN) * PX_PER_MHZ;
}

function xToFreq(x: number): number {
  return clampFrequency(FM_MIN + x / PX_PER_MHZ);
}

const MAJOR_TICKS = [86, 89, 92, 95, 98, 101, 104, 107, 110];

function formatFreq(f: number): string {
  return `${f.toFixed(1)} MHz`;
}

export default function TunerScreen() {
  const insets = useSafeAreaInsets();
  const { stations, favoriteIds, toggleFavorite, isFavorite } = useCatalogContext();
  const { currentStation, status, playStation, pause, stop } = useRadioPlayerContext();

  const availableFreqs = getAvailableFrequencies(stations);

  const initialFreq = currentStation?.frequency && currentStation.band === 'FM'
    ? Math.round(currentStation.frequency * 10) / 10
    : FM_MIN;

  const [frequency, setFrequency] = useState(initialFreq);
  const rulerRef = useRef<View>(null);
  const rulerLayoutX = useRef(0);

  const station = findExactStationByFrequency(stations, frequency);
  const freqRounded = Math.round(frequency * 10) / 10;
  const isActive = currentStation?.id === station?.id;
  const isPlaying = isActive && status === PlayerStatus.PLAYING;
  const isStationLoading = isActive && (status === PlayerStatus.LOADING || status === PlayerStatus.BUFFERING);
  const fav = station ? isFavorite(station.id) : false;

  const updateFreqFromPageX = useCallback((pageX: number) => {
    const local = pageX - rulerLayoutX.current;
    setFrequency(xToFreq(local));
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        updateFreqFromPageX(evt.nativeEvent.pageX);
      },
      onPanResponderMove: (evt) => {
        updateFreqFromPageX(evt.nativeEvent.pageX);
      },
    }),
  ).current;

  const handlePrev = useCallback(() => {
    const prev = findPrevAvailableFreq(availableFreqs, frequency);
    if (prev != null) setFrequency(prev);
    else setFrequency(clampFrequency(frequency - FM_STEP));
  }, [availableFreqs, frequency]);

  const handleNext = useCallback(() => {
    const next = findNextAvailableFreq(availableFreqs, frequency);
    if (next != null) setFrequency(next);
    else setFrequency(clampFrequency(frequency + FM_STEP));
  }, [availableFreqs, frequency]);

  const handlePower = useCallback(() => {
    if (isActive && isPlaying) {
      pause();
    } else if (station) {
      playStation(station);
    }
  }, [isActive, isPlaying, pause, playStation, station]);

  const handleStar = useCallback(() => {
    if (station) toggleFavorite(station.id);
  }, [station, toggleFavorite]);

  const handleRulerLayout = useCallback(() => {
    rulerRef.current?.measure((_x, _y, _w, _h, pageX) => {
      rulerLayoutX.current = pageX;
    });
  }, []);

  const indicatorX = freqToX(frequency);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Radio</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <View style={styles.powerBtn}>
            <Power size={16} color="#22C55E" />
          </View>
          <View style={styles.recBtn}>
            <View style={styles.recDot} />
            <Text style={styles.recText}>REC</Text>
          </View>
        </View>

        <View style={styles.freqRow}>
          <Pressable onPress={handlePrev} style={styles.arrowBtn} hitSlop={12}>
            <ChevronLeft size={28} color="#1F3B5C" />
          </Pressable>
          <Text style={styles.freqValue}>{formatFreq(frequency)}</Text>
          <Pressable onPress={handleNext} style={styles.arrowBtn} hitSlop={12}>
            <ChevronRight size={28} color="#1F3B5C" />
          </Pressable>
        </View>

        {station ? (
          <View style={styles.stationInfo}>
            <Text style={styles.stationName} numberOfLines={1}>{station.name}</Text>
            <Pressable onPress={handleStar} style={styles.starBtn} hitSlop={8}>
              <Star size={20} color="#F5A623" fill={fav ? '#F5A623' : 'transparent'} />
            </Pressable>
          </View>
        ) : (
          <Text style={styles.noStation}>Sin estación en esta frecuencia</Text>
        )}

        <View style={styles.controlsRow}>
          <Pressable
            onPress={handlePower}
            disabled={!station}
            style={[styles.playBtn, (!station) && styles.playBtnDisabled]}
          >
            {isStationLoading ? (
              <Text style={styles.loadingDots}>···</Text>
            ) : isPlaying ? (
              <Pause size={36} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play size={36} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 4 }} />
            )}
          </Pressable>
        </View>

        <View
          ref={rulerRef}
          style={styles.rulerContainer}
          onLayout={handleRulerLayout}
          {...panResponder.panHandlers}
        >
          <View style={styles.rulerTrack}>
            {MAJOR_TICKS.map((tick) => {
              const x = freqToX(tick);
              return (
                <View key={`major-${tick}`} style={[styles.majorTick, { left: x }]}>
                  <Text style={styles.tickLabel}>{tick}</Text>
                </View>
              );
            })}
            {Array.from({ length: Math.floor(FREQ_RANGE) }, (_, i) => {
              const tickFreq = Math.floor(FM_MIN) + i + 1;
              if (tickFreq >= FM_MAX || MAJOR_TICKS.includes(tickFreq)) return null;
              return (
                <View
                  key={`minor-${tickFreq}`}
                  style={[styles.minorTick, { left: freqToX(tickFreq) }]}
                />
              );
            })}
          </View>
          <View style={[styles.indicator, { left: indicatorX - 6 }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  card: {
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  powerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  recText: { fontSize: 11, fontWeight: '700', color: '#EF4444', letterSpacing: 1 },
  freqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 4,
  },
  arrowBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  freqValue: { fontSize: 42, fontWeight: '700', color: '#1F3B5C', letterSpacing: -1 },
  stationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  stationName: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  starBtn: { padding: 4 },
  noStation: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 12,
  },
  controlsRow: { alignItems: 'center', marginBottom: 20 },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1F3B5C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnDisabled: { opacity: 0.35 },
  loadingDots: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', letterSpacing: 4 },
  rulerContainer: {
    height: 56,
    justifyContent: 'center',
  },
  rulerTrack: {
    height: 40,
    position: 'relative',
  },
  majorTick: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: 0,
    borderLeftWidth: 2,
    borderLeftColor: '#9CA3AF',
    height: 28,
  },
  tickLabel: {
    position: 'absolute',
    bottom: -16,
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    width: 30,
    textAlign: 'center',
    marginLeft: -15,
  },
  minorTick: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#D1D5DB',
    height: 14,
  },
  indicator: {
    position: 'absolute',
    bottom: 4,
    width: 12,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
});
