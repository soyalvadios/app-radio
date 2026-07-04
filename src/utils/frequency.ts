import type { RadioStation } from '../types';

const FM_MIN = 86.0;
const FM_MAX = 110.0;
const FM_STEP = 0.1;

export { FM_MIN, FM_MAX, FM_STEP };

export function getAvailableFrequencies(stations: RadioStation[]): number[] {
  const freqs = new Set<number>();
  for (const s of stations) {
    if (s.band === 'FM' && s.frequency && s.frequency > 0) {
      freqs.add(Math.round(s.frequency * 10) / 10);
    }
  }
  return Array.from(freqs).sort((a, b) => a - b);
}

export function findExactStationByFrequency(
  stations: RadioStation[],
  frequency: number,
): RadioStation | undefined {
  const f = Math.round(frequency * 10) / 10;
  return stations.find(
    (s) => s.band === 'FM' && s.frequency && Math.round(s.frequency * 10) / 10 === f,
  );
}

export function findNearestStationByFrequency(
  stations: RadioStation[],
  frequency: number,
): RadioStation | undefined {
  const f = Math.round(frequency * 10) / 10;
  const avail = getAvailableFrequencies(stations);
  if (avail.length === 0) return undefined;
  const nearest = avail.reduce((prev, curr) =>
    Math.abs(curr - f) < Math.abs(prev - f) ? curr : prev,
  );
  return findExactStationByFrequency(stations, nearest);
}

export function snapToStep(value: number): number {
  return Math.round(value / FM_STEP) * FM_STEP;
}

export function clampFrequency(value: number): number {
  return Math.max(FM_MIN, Math.min(FM_MAX, snapToStep(value)));
}

export function findPrevAvailableFreq(
  availableFreqs: number[],
  current: number,
): number | null {
  const f = Math.round(current * 10) / 10;
  const lower = availableFreqs.filter((x) => x < f);
  if (lower.length === 0) return null;
  return lower[lower.length - 1];
}

export function findNextAvailableFreq(
  availableFreqs: number[],
  current: number,
): number | null {
  const f = Math.round(current * 10) / 10;
  const higher = availableFreqs.filter((x) => x > f);
  if (higher.length === 0) return null;
  return higher[0];
}
