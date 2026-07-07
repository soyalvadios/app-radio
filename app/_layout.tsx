// app/_layout.tsx
import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
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
  const pathname = usePathname();

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="player" options={{ presentation: 'modal' }} />
      </Stack>

      {pathname !== '/player' && (
        <MiniPlayer bottomOffset={insets.bottom + TAB_BAR_HEIGHT + 8} />
      )}
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
