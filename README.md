<p align="center">
  <img src="./logo.png" alt="Nopales Radio logo" width="180" />
</p>

<h1 align="center">Nopales Radio</h1>

<p align="center">
  Streaming mexicano de estaciones de radio online.
</p>

Reproductor de estaciones de radio mexicanas en streaming. Construido con Expo / React Native.

## Features

- **50+ estaciones reales** de Ciudad de México (FM/AM)
- **Búsqueda** por nombre, frecuencia, género o ciudad
- **Filtro por estado** (preparado para expandir a todo México)
- **Favoritos** con persistencia local
- **Reproducción en segundo plano**
- **Offline-first** — catálogo y favoritos disponibles sin internet
- **Modo Offline** — detección de conectividad, pausa/reanuda automático
- **Sleep timer** — 15/30/45/60 min
- **Control de volumen** con slider táctil
- **MiniPlayer persistente** sobre la tab bar

## Stack

| Capa | Librería |
|------|----------|
| Framework | Expo SDK ~54 + expo-router |
| UI | React Native 0.81, lucide-react-native |
| Audio | expo-audio (AAC, MP3, HLS) |
| Persistencia | AsyncStorage |
| Red | @react-native-community/netinfo |

## Requisitos

- Node.js 20+
- Expo CLI (`npm i -g expo-cli`) o `npx expo`
- Expo Go en tu dispositivo (iOS/Android) o simulador

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm start          # escanea QR con Expo Go
npm run ios        # simulador iOS
npm run android    # emulador Android
npm run typecheck  # verifica tipos TS
```

## Estructura

```
app/                  # páginas (expo-router: file-based)
  _layout.tsx          # raíz: SafeAreaProvider, RadioPlayerProvider, MiniPlayer
  index.tsx            # onboarding: selección de estado
  (tabs)/
    _layout.tsx        # tabs layout + CatalogProvider
    index.tsx          # HomeScreen (inicio)
    favorites.tsx      # favoritos
  player.tsx           # pantalla full del reproductor (modal)
src/
  components/          # StationCard, MiniPlayer
  context/             # RadioPlayerContext, CatalogContext
  hooks/               # useRadioPlayer, useCatalog, useNetworkStatus
  screens/             # HomeScreen
  services/            # NetworkService, CatalogStorageService, RadioHardwareInterface
  theme/               # layout.ts (constantes compartidas)
  types.ts             # tipos TS
stations_parsed.json   # 50 estaciones scrapeadas (fuente del catálogo)
```

## Offline

El catálogo se siembra en AsyncStorage al primer arranque con versión de datos para migraciones futuras. La búsqueda y filtros funcionan completamente sin internet (filtrado en memoria). El streaming se pausa al perder conexión y reanuda automáticamente al recuperarla.

## Roadmap

- [ ] Catálogo nacional (estaciones de los 32 estados)
- [ ] Modulo FM por hardware (Android)
- [ ] Sintonización por frecuencia
- [ ] Grabación de streaming
- [ ] Widget de reproducción (Android)
- [ ] CarPlay / Android Auto

## Disclaimer

Esta app es un proyecto personal de código abierto. Las estaciones incluidas pertenecen a sus respectivos dueños. Los stream URLs pueden cambiar sin previo aviso. No se garantiza la disponibilidad de todas las estaciones.

## Licencia

MIT
