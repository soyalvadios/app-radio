// src/screens/HomeScreen.tsx
import { useCallback, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronDown, Radio, Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCatalogContext } from '../context/CatalogContext';
import { StationCard } from '../components/StationCard';
import type { MexicanState, RadioStation } from '../types';
import { CatalogStorageService } from '../services/CatalogStorageService';

const COLORS = {
  accent: '#1F3B5C',
  text: '#1A1A1A',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    loading,
    stations,
    filteredStations,
    searchQuery,
    setSearchQuery,
    selectedState,
    setSelectedState,
    selectedGenre,
    setSelectedGenre,
    availableGenres,
    isFavorite,
    toggleFavorite,
  } = useCatalogContext();

  useEffect(() => {
    CatalogStorageService.getPreferredState().then((state) => {
      if (state) setSelectedState(state);
    });
  }, []);

  const availableStates = useMemo(() => {
    const set = new Set<MexicanState>();
    stations.forEach((s) => set.add(s.state));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
  }, [stations]);

  const renderItem = useCallback(
    ({ item }: { item: RadioStation }) => (
      <StationCard
        station={item}
        isFavorite={isFavorite(item.id)}
        onToggleFavorite={toggleFavorite}
      />
    ),
    [isFavorite, toggleFavorite],
  );

  const handleStatePicker = () => {
    const options: { text: string; onPress?: () => void }[] = [
      { text: 'Todos los estados', onPress: () => setSelectedState(null) },
      ...availableStates.map((st) => ({
        text: st,
        onPress: () => setSelectedState(st),
      })),
      { text: 'Cancelar' },
    ];

    Alert.alert('Filtrar por estado', undefined, options);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.searchBar}>
            <Search size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar estación, frecuencia…"
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
          </View>
          <Pressable
            onPress={() => router.navigate('/(tabs)/tuner')}
            style={styles.tunerBtn}
            accessibilityRole="button"
            accessibilityLabel="Sintonizar por frecuencia"
          >
            <Radio size={22} color={COLORS.accent} />
          </Pressable>
        </View>

        <Pressable
          onPress={handleStatePicker}
          style={styles.dropdown}
          accessibilityRole="button"
          accessibilityLabel="Seleccionar estado"
        >
          <Text style={styles.dropdownText} numberOfLines={1}>
            {selectedState ?? 'Todos los estados'}
          </Text>
          <ChevronDown size={16} color={COLORS.textMuted} />
        </Pressable>

        {availableGenres.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.genreRow}
          >
            <Pressable
              onPress={() => setSelectedGenre(null)}
              style={[styles.genreChip, selectedGenre == null && styles.genreChipActive]}
            >
              <Text style={[styles.genreChipText, selectedGenre == null && styles.genreChipTextActive]}>
                Todos
              </Text>
            </Pressable>
            {availableGenres.map((genre) => (
              <Pressable
                key={genre}
                onPress={() => setSelectedGenre(genre)}
                style={[styles.genreChip, selectedGenre === genre && styles.genreChipActive]}
              >
                <Text style={[styles.genreChipText, selectedGenre === genre && styles.genreChipTextActive]}>
                  {genre}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredStations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyTitle}>Sin resultados</Text>
              <Text style={styles.emptyText}>Ajusta la búsqueda o el filtro de estado.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexShrink: 0,
    zIndex: 10,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tunerBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 0,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
    marginHorizontal: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    alignSelf: 'flex-start',
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 180,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    gap: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  genreRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  genreChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
  },
  genreChipActive: {
    backgroundColor: COLORS.accent,
  },
  genreChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  genreChipTextActive: {
    color: '#FFFFFF',
  },
});
