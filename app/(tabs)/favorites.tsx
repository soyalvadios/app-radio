// app/(tabs)/favorites.tsx
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCatalogContext } from '../../src/context/CatalogContext';
import { StationCard } from '../../src/components/StationCard';
import type { RadioStation } from '../../src/types';

const COLORS = {
  accent: '#1F3B5C',
  accentTint: '#EAF0F7',
  bg: '#F4F6F9',
  text: '#1A1A1A',
  textMuted: '#6B7280',
};

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { favoriteStations, isFavorite, toggleFavorite, loading } = useCatalogContext();

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

  // Solo spinner a pantalla completa en la primera carga sin datos: al re-enfocar
  // con favoritos ya cargados, no parpadea.
  const showSpinner = loading && favoriteStations.length === 0;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.header}>Favoritos</Text>

      {showSpinner ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      ) : (
        <FlatList
          data={favoriteStations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Star size={28} color={COLORS.accent} />
              </View>
              <Text style={styles.emptyTitle}>Aún no tienes favoritos</Text>
              <Text style={styles.emptyText}>
                Toca la estrella en cualquier estación para guardarla aquí.
              </Text>
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
    backgroundColor: COLORS.bg,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 160, // deja aire para tab bar + MiniPlayer flotante
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
    gap: 8,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accentTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
