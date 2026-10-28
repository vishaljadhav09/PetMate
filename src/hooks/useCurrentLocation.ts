import * as Location from 'expo-location';
import { useCallback, useState } from 'react';
import { addressQueries } from '@/utils/address';
import type { AddressParts } from '@/utils/address';

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

  /**
   * Resolves a typed address to coordinates, trying each query in turn (most precise first) and
   * using the first match. Used for pet and home addresses, and as the fallback when device
   * location permission is denied.
   */
  const setFromQueries = useCallback(async (queries: string[]): Promise<Coordinates | null> => {
    setStatus('loading');
    try {
      for (const query of queries) {
        const [match] = await Location.geocodeAsync(query);
        if (match) {
          const next = { lat: match.latitude, lng: match.longitude };
          setCoordinates(next);
          setStatus('granted');
          return next;
        }
      }
      setStatus('error');
      return null;
    } catch {
      setStatus('error');
      return null;
    }
  }, []);

  const setFromCity = useCallback(
    (city: string) => {
      const query = city.trim();
      return query ? setFromQueries([query]) : Promise.resolve(null);
    },
    [setFromQueries]
  );

  const setFromAddress = useCallback(
    (address: AddressParts) => setFromQueries(addressQueries(address)),
    [setFromQueries]
  );

  return { coordinates, status, request, setFromCity, setFromAddress };
}
