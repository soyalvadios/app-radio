// app/_layout.tsx
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { RadioPlayerProvider } from '../src/context/RadioPlayerContext';
import { MiniPlayer } from '../src/components/MiniPlayer';
import { TAB_BAR_HEIGHT } from '../src/theme/layout';

/**
 * Contenido raíz. Va DENTRO de RadioPlayerProvider y SafeAreaProvider para
 * que el MiniPlayer pueda consumir el contexto del reproductor y los insets.
 */
function RootContent() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="player" options={{ presentation: 'modal' }} />
      </Stack>

      {/*
        MiniPlayer PERSISTENTE: vive aquí, fuera de las pantallas, así sigue
        visible al cambiar de pestaña. Lo posicionamos justo encima de la tab
        bar = alto de la barra + safe-area inferior + un pequeño respiro.
      */}
      <MiniPlayer bottomOffset={insets.bottom + TAB_BAR_HEIGHT + 8} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RadioPlayerProvider>
        <RootContent />
        <StatusBar style="dark" />
      </RadioPlayerProvider>
    </SafeAreaProvider>
  );
}
