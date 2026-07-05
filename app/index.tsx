import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';

import { CatalogStorageService } from '../src/services/CatalogStorageService';
import { MEXICAN_STATES, type MexicanState } from '../src/types';

export default function IndexScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MexicanState | null>(null);

  useEffect(() => {
    CatalogStorageService.getPreferredState().then((state) => {
      if (state) {
        router.replace('/(tabs)');
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!selected) return;
    await CatalogStorageService.setPreferredState(selected);
    router.replace('/(tabs)');
  }, [selected]);

  if (loading) return null;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 40 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>
          Selecciona tu estado para ver las estaciones de radio locales. Catálogo nacional próximamente.
        </Text>
      </View>

      <FlatList
        data={[...MEXICAN_STATES]}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelected(item)}
            style={({ pressed }) => [
              styles.row,
              selected === item && styles.rowActive,
              pressed && styles.rowPressed,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: selected === item }}
          >
            <Text style={[styles.rowText, selected === item && styles.rowTextActive]}>
              {item}
            </Text>
            {selected === item && <Check size={20} color="#1F3B5C" />}
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 20 }]}>
        <Pressable
          onPress={handleConfirm}
          disabled={!selected}
          style={[styles.confirmBtn, !selected && styles.confirmBtnDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Confirmar selección"
        >
          <Text style={[styles.confirmText, !selected && styles.confirmTextDisabled]}>
            Continuar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 22,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  rowActive: {
    backgroundColor: '#F2F2F7',
  },
  rowPressed: {
    opacity: 0.6,
  },
  rowText: {
    fontSize: 17,
    color: '#1A1A1A',
    fontWeight: '400',
  },
  rowTextActive: {
    fontWeight: '600',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5EA',
    marginLeft: 8,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  confirmBtn: {
    backgroundColor: '#1F3B5C',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: '#F2F2F7',
  },
  confirmText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  confirmTextDisabled: {
    color: '#C7C7CC',
  },
});
