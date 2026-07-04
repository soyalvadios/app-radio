<p align="center">
  <img src="./logo.png" alt="Nopales Radio logo" width="180" />
</p>

<h1 align="center">Nopales Radio 📻</h1>

<p align="center">
  🎧 Radio mexicana online — sin anuncios, sin cuentas, sin complicaciones.
</p>

Una app hecha con ❤️ y Expo para escuchar estaciones de radio mexicanas en streaming. Porque el radio no debería necesitar más que un tap.

## 🚀 Features

- 📡 **50+ estaciones reales** de CDMX (FM/AM)
- 🔍 **Búsqueda instantánea** por nombre, frecuencia o género
- 🗺️ **Filtro por estado** (y contando…)
- ⭐ **Favoritos** con persistencia local
- 📴 **Offline-first** — catálogo sin internet
- 🔄 **Auto-resume** al reconectar
- ⏰ **Sleep timer** (15/30/45/60 min)
- 🔊 **Control de volumen** con slider táctil
- 🎵 **MiniPlayer persistente** + pantalla full
- 🔇 **Modo Offline** automático

## 🛠️ Stack

| Capa | Librería |
|------|----------|
| 📱 Framework | Expo SDK ~54 + expo-router |
| 🎨 UI | React Native 0.81, lucide-react-native |
| 🎵 Audio | expo-audio (AAC, MP3, HLS) |
| 💾 Persistencia | AsyncStorage |
| 🌐 Red | @react-native-community/netinfo |

## 📋 Requisitos

- Node.js 20+
- Expo Go en tu celu o simulador

## ⚡ Instalación

```bash
npm install
npm start        # escanea el QR con Expo Go
npm run ios      # simulador iOS
npm run android  # emulador Android
npm run typecheck  # chequea tipos
```

## 📁 Estructura

```
app/                  # páginas (expo-router)
  _layout.tsx         # layout raíz
  index.tsx           # onboarding
  (tabs)/             # tabs: Inicio + Favoritos
  player.tsx          # pantalla full del reproductor
src/
  components/         # StationCard, MiniPlayer
  context/            # RadioPlayerContext, CatalogContext
  hooks/              # useRadioPlayer, useCatalog, useNetworkStatus
  screens/            # HomeScreen
  services/           # NetworkService, CatalogStorageService + FM hardware
  theme/              # constantes de layout
  types.ts            # tipos compartidos
stations_parsed.json  # 50 estaciones reales
```

## 📴 Modo Offline

El catálogo se guarda localmente al primerarranque. Búsqueda y filtros jalan sin internet. El streaming se pausa solo si no hay conexión y reanuda solito cuando vuelves.

## 🗺️ Roadmap

- [ ] 📍 Catálogo nacional (32 estados)
- [x] 🔄 Sintonización por frecuencia (streaming del catálogo)
- [ ] 📻 FM por hardware (Android, futuro)
- [ ] ⏺️ Grabación de streaming
- [ ] 📱 Widget Android
- [ ] 🚗 CarPlay / Android Auto

## ☕ Apoya el proyecto

Nopales Radio es un proyecto personal open-source hecho con cariño.
Si te sirvió, te gustó o quieres apoyar futuras mejoras, puedes invitarme un café por PayPal:

<p align="center">
  <a href="https://paypal.me/DAlvarado693" target="_blank">
    <img src="https://img.shields.io/badge/PayPal-Invítame%20un%20café-00457C?style=for-the-badge&logo=paypal&logoColor=white" alt="Apoya con PayPal" />
  </a>
</p>

> El apoyo es voluntario. El código sigue siendo MIT y libre para usar, modificar y compartir.

## 📦 Build APK Android

```bash
npm install
npm run typecheck
npx eas build:configure
npx eas build -p android --profile preview
```

## ⚖️ Disclaimer

Esta app es un proyecto personal open-source. Las estaciones, logos y stream URLs pertenecen a sus respectivos dueños. Los URLs pueden cambiar sin aviso. No garantizamos disponibilidad eterna de cada estación.

## 📄 Licencia

MIT — haz lo que quieras con el código, pero invítanos un café si te gusta ☕
