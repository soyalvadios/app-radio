// src/hooks/useCatalog.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CatalogStorageService } from '../services/CatalogStorageService';
import type { MexicanState, RadioStation } from '../types';

/** Normaliza para búsqueda: sin acentos, minúsculas, sin espacios extra. */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export const GENRES = [
  'Noticias',
  'Pop',
  'Rock',
  'Romántica',
  'Regional mexicano',
  'Clásica',
  'Jazz',
  'Electrónica',
  'Salsa',
  'Cultural',
  'Universitaria',
] as const;

export type Genre = (typeof GENRES)[number];

export interface UseCatalogReturn {
  loading: boolean;
  error: string | null;
  stations: RadioStation[]; // catálogo completo
  filteredStations: RadioStation[]; // tras filtro de estado + género + búsqueda
  favoriteStations: RadioStation[];
  favoriteIds: Set<string>;
  searchQuery: string;
  selectedState: MexicanState | null;
  selectedGenre: Genre | null;
  availableGenres: Genre[];
  setSearchQuery: (query: string) => void;
  setSelectedState: (state: MexicanState | null) => void;
  setSelectedGenre: (genre: Genre | null) => void;
  toggleFavorite: (stationId: string) => Promise<void>;
  isFavorite: (stationId: string) => boolean;
  refresh: () => Promise<void>;
}

export function useCatalog(): UseCatalogReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<MexicanState | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // initialize() siembra el seed si está vacío y devuelve el catálogo.
      const [catalog, favIds] = await Promise.all([
        CatalogStorageService.initialize(),
        CatalogStorageService.getFavoriteIds(),
      ]);
      setStations(catalog);
      setFavoriteIds(new Set(favIds));
    } catch (e) {
      console.error('[useCatalog] load', e);
      setError('No se pudo cargar el catálogo local.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Reset selectedState if no stations match (e.g., preferred state has no catalog entries)
  useEffect(() => {
    if (stations.length > 0 && selectedState != null) {
      const states = new Set(stations.map((s) => s.state));
      if (!states.has(selectedState)) setSelectedState(null);
    }
  }, [stations, selectedState]);

  // Géneros disponibles derivados del catálogo (solo los que tienen al menos una estación)
  const availableGenres = useMemo(() => {
    return GENRES.filter((genre) => {
      const ng = normalize(genre);
      return stations.some((s) => s.tags.some((t) => normalize(t).includes(ng)));
    });
  }, [stations]);

  // Filtrado en memoria: estado + género + búsqueda textual combinados.
  const filteredStations = useMemo(() => {
    const q = normalize(searchQuery);
    return stations.filter((station) => {
      if (selectedState != null && station.state !== selectedState) return false;
      if (selectedGenre != null) {
        const ng = normalize(selectedGenre);
        if (!station.tags.some((t) => normalize(t).includes(ng))) return false;
      }
      if (q.length === 0) return true;
      const haystack = normalize(
        `${station.name} ${station.frequency} ${station.city ?? ''} ${station.genre ?? ''} ${station.state} ${station.tags.join(' ')}`,
      );
      return haystack.includes(q);
    });
  }, [stations, selectedState, selectedGenre, searchQuery]);

  const favoriteStations = useMemo(
    () => stations.filter((station) => favoriteIds.has(station.id)),
    [stations, favoriteIds],
  );

  const isFavorite = useCallback(
    (stationId: string) => favoriteIds.has(stationId),
    [favoriteIds],
  );

  const favoriteIdsRef = useRef(favoriteIds);
  useEffect(() => { favoriteIdsRef.current = favoriteIds; }, [favoriteIds]);

  const toggleFavorite = useCallback(async (stationId: string) => {
    const prevSnapshot = new Set(favoriteIdsRef.current);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(stationId)) next.delete(stationId);
      else next.add(stationId);
      return next;
    });

    try {
      const persisted = await CatalogStorageService.toggleFavorite(stationId);
      setFavoriteIds(new Set(persisted));
    } catch (e) {
      console.error('[useCatalog] toggleFavorite', e);
      setFavoriteIds(prevSnapshot);
      setError('No se pudo actualizar favoritos.');
    }
  }, []);

  return {
    loading,
    error,
    stations,
    filteredStations,
    favoriteStations,
    favoriteIds,
    searchQuery,
    selectedState,
    selectedGenre,
    availableGenres,
    setSearchQuery,
    setSelectedState,
    setSelectedGenre,
    toggleFavorite,
    isFavorite,
    refresh: load,
  };
}
