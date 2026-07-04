// src/hooks/useNetworkStatus.ts
import { useEffect, useState } from 'react';
import { NetworkService } from '../services/NetworkService';
import type { NetworkStatus } from '../types';

// Arrancamos optimistas (online) para no mostrar "offline" en el primer frame
// antes de que NetInfo resuelva el estado real.
const INITIAL: NetworkStatus = {
  isConnected: true,
  isInternetReachable: true,
  type: 'unknown',
  isOffline: false,
};

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(INITIAL);

  useEffect(() => {
    let mounted = true;

    NetworkService.getStatus().then((s) => {
      if (mounted) setStatus(s);
    });

    const unsubscribe = NetworkService.subscribe((s) => {
      if (mounted) setStatus(s);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return status;
}
