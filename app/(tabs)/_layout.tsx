import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, Star } from 'lucide-react-native';
import { CatalogProvider } from '../../src/context/CatalogContext';
import { TAB_BAR_HEIGHT } from '../../src/theme/layout';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <CatalogProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: TAB_BAR_HEIGHT + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarActiveTintColor: '#1F3B5C',
          tabBarInactiveTintColor: '#6B7280',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favoritos',
            tabBarIcon: ({ color, size }) => <Star size={size} color={color} />,
          }}
        />
      </Tabs>
    </CatalogProvider>
  );
}
