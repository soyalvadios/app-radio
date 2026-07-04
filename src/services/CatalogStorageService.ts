// src/services/CatalogStorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MexicanState, RadioBand, RadioStation } from '../types';

const CATALOG_KEY = '@radio_catalog_v5';
const CATALOG_VERSION_KEY = '@radio_catalog_version';
const FAVORITES_KEY = '@radio/favorites/v2';
const PREFERRED_STATE_KEY = '@radio/preferred_state';
const CATALOG_VERSION = 1;

interface StationsRaw {
  name: string[];
  url: string[];
  url_resolved: string[];
  tags: string[];
  bitrate: number[];
  codec: string[];
  favicon: string[];
  homepage: string[];
  state: string[];
  votes: number[];
}

function fixEncoding(text: string): string {
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const cp = text.charCodeAt(i);
    if (cp > 0xFF) return text;
    bytes.push(cp);
  }
  const out: string[] = [];
  let i = 0;
  while (i < bytes.length) {
    const b = bytes[i];
    if (b < 0x80) { out.push(String.fromCodePoint(b)); i++; }
    else if (b < 0xC0) { out.push(String.fromCodePoint(b)); i++; }
    else if (b < 0xE0 && i + 1 < bytes.length) {
      out.push(String.fromCodePoint(((b & 0x1F) << 6) | (bytes[i + 1] & 0x3F))); i += 2;
    } else if (b < 0xF0 && i + 2 < bytes.length) {
      out.push(String.fromCodePoint(((b & 0x0F) << 12) | ((bytes[i + 1] & 0x3F) << 6) | (bytes[i + 2] & 0x3F))); i += 3;
    } else { i++; }
  }
  return out.join('');
}

function parseFreqBand(tags: string[], name: string): { frequency: number; band: RadioBand } {
  for (const tag of tags) {
    const t = tag.trim().toLowerCase();
    const m = t.match(/^(\d+(?:\.\d+)?)\s*(fm|am)$/);
    if (m) {
      return { frequency: parseFloat(m[1]), band: m[2].toUpperCase() as RadioBand };
    }
  }
  const trimmed = name.trim();
  const start = trimmed.match(/^(\d+(?:\.\d+)?)\s*(fm|am)?/i);
  if (start) {
    const f = parseFloat(start[1]);
    const b = start[2]?.toUpperCase() as RadioBand | undefined;
    if (b) return { frequency: f, band: b };
    return { frequency: f, band: f >= 88 ? 'FM' : 'AM' };
  }
  const paren = trimmed.match(/\((\d+(?:\.\d+))\)/);
  if (paren) {
    const f = parseFloat(paren[1]);
    return { frequency: f, band: f >= 88 ? 'FM' : 'AM' };
  }
  return { frequency: 0, band: 'FM' };
}

function parseStations(raw: StationsRaw): RadioStation[] {
  const seen = new Set<string>();
  const out: RadioStation[] = [];
  for (let i = 0; i < raw.name.length; i++) {
    const url = raw.url_resolved[i] || raw.url[i];
    if (seen.has(url)) continue;
    seen.add(url);
    const tags = raw.tags[i].split(',');
    const { frequency, band } = parseFreqBand(tags, raw.name[i]);
    out.push({
      id: `s${i}`,
      name: fixEncoding(raw.name[i]).trim(),
      frequency,
      band,
      streamUrl: url,
      state: 'Ciudad de México' as MexicanState,
      city: 'Ciudad de México',
      logo: raw.favicon[i] || '',
      genre: raw.codec[i] ? `${raw.codec[i]} · ${raw.bitrate[i]}kbps` : undefined,
    });
  }
  return out;
}

const PARSED_STATIONS = parseStations(require('../../stations_parsed.json') as StationsRaw);

async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`[CatalogStorage] read ${key}`, e);
    return fallback;
  }
}

async function writeJSON(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function initialize(): Promise<RadioStation[]> {
  const version = await readJSON<number>(CATALOG_VERSION_KEY, 0);
  if (version < CATALOG_VERSION) {
    await writeJSON(CATALOG_KEY, PARSED_STATIONS);
    await writeJSON(CATALOG_VERSION_KEY, CATALOG_VERSION);
    return PARSED_STATIONS;
  }
  return readJSON<RadioStation[]>(CATALOG_KEY, PARSED_STATIONS);
}

async function getAllStations(): Promise<RadioStation[]> {
  return readJSON<RadioStation[]>(CATALOG_KEY, []);
}

async function getStationsByState(state: MexicanState): Promise<RadioStation[]> {
  const all = await getAllStations();
  return all.filter((s) => s.state === state);
}

async function saveCatalog(stations: RadioStation[]): Promise<void> {
  await writeJSON(CATALOG_KEY, stations);
}

async function getFavoriteIds(): Promise<string[]> {
  return readJSON<string[]>(FAVORITES_KEY, []);
}

async function toggleFavorite(stationId: string): Promise<string[]> {
  const ids = await getFavoriteIds();
  const next = ids.includes(stationId)
    ? ids.filter((id) => id !== stationId)
    : [...ids, stationId];
  await writeJSON(FAVORITES_KEY, next);
  return next;
}

async function getFavoriteStations(): Promise<RadioStation[]> {
  const [all, ids] = await Promise.all([getAllStations(), getFavoriteIds()]);
  const favSet = new Set(ids);
  return all.filter((s) => favSet.has(s.id));
}

async function getPreferredState(): Promise<MexicanState | null> {
  const raw = await AsyncStorage.getItem(PREFERRED_STATE_KEY);
  return raw as MexicanState | null;
}

async function setPreferredState(state: MexicanState): Promise<void> {
  await AsyncStorage.setItem(PREFERRED_STATE_KEY, state);
}

export const CatalogStorageService = {
  initialize,
  getAllStations,
  getStationsByState,
  saveCatalog,
  getFavoriteIds,
  toggleFavorite,
  getFavoriteStations,
  getPreferredState,
  setPreferredState,
} as const;
