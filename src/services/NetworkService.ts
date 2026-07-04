// src/services/NetworkService.ts
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import type { NetworkStatus } from '../types';

export type NetworkListener = (status: NetworkStatus) => void;
export type Unsubscribe = () => void;

function mapState(state: NetInfoState): NetworkStatus {
  const isConnected = Boolean(state.isConnected);
  // `isInternetReachable` puede ser null mientras el SO lo determina.
  // Lo tratamos como "alcanzable" para no falsear un offline en el arranque.
  const isInternetReachable = state.isInternetReachable !== false;
  return {
    isConnected,
    isInternetReachable,
    type: state.type,
    isOffline: !isConnected || !isInternetReachable,
  };
}

/**
 * Capa de abstracción de red. Hoy usa @react-native-community/netinfo, pero
 * los hooks/UI dependen de ESTA interfaz, no de la librería. Para migrar a
 * `expo-network` solo se reimplementan `getStatus` y `subscribe`.
 */
export const NetworkService = {
  async getStatus(): Promise<NetworkStatus> {
    return mapState(await NetInfo.fetch());
  },

  subscribe(listener: NetworkListener): Unsubscribe {
    return NetInfo.addEventListener((state) => listener(mapState(state)));
  },
};
