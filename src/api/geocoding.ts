import type { GeocodingResult } from '../types/Geocoding.ts';
import { GEOCODING_URL } from '../utils/constants.ts';

export async function searchCity(name: string): Promise<GeocodingResult | null> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=1&language=es&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json() as { results?: GeocodingResult[] };
    const result = data.results?.[0];
    if (!result) return null;

    return {
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      admin1: result.admin1,
    };
  } catch {
    return null;
  }
}
