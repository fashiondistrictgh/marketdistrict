import { useState } from "react";
import * as Location from "expo-location";

export interface DetectedAddress {
  line1: string;
  city: string;
}

/**
 * Gets the device's current location and reverse-geocodes it to a street/city.
 * Uses Expo's built-in geocoder — free, no API key.
 */
export function useCurrentLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function detect(): Promise<DetectedAddress | null> {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied. Enable it in settings.");
        return null;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const [place] = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });

      if (!place) {
        setError("Could not determine your address.");
        return null;
      }

      const line1 = [place.name, place.street, place.district]
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(", ");

      return {
        line1: line1 || place.formattedAddress || "Current location",
        city: place.city ?? place.region ?? place.subregion ?? "",
      };
    } catch {
      setError("Could not get your location. Try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { detect, loading, error };
}
