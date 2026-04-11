import { useState, useCallback } from "react";

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  mapsLink: string;
  timestamp: number;
}

export function useGeolocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback((): Promise<LocationData | null> => {
    return new Promise((resolve) => {
      if (!("geolocation" in navigator)) {
        setError("Geolocation not supported");
        resolve(null);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          const data: LocationData = {
            latitude,
            longitude,
            accuracy,
            mapsLink,
            timestamp: Date.now(),
          };
          setLocation(data);
          setLoading(false);
          resolve(data);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }, []);

  return { location, loading, error, getLocation };
}
