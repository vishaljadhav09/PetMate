import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

export interface Coordinates {
  lat: number;
  lng: number;
}

export type LocationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'error';

/**
 * Asks for foreground location permission and reads the current position on demand.
 * `status === 'denied'` lets the UI fall back to a manual city entry.
 */
export function useCurrentLocation() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<LocationStatus>('idle');

  const request = useCallback(async (): Promise<Coordinates | null> => {
    setStatus('loading');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setStatus('denied');
        return null;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const next = { lat: position.coords.latitude, lng: position.coords.longitude };
      setCoordinates(next);
      setStatus('granted');
      return next;
    } catch {
      setStatus('error');
      return null;
    }
  }, []);

  return { coordinates, status, request };
}
