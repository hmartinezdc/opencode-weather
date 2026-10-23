import type { GeocodingResult, ForecastResult, DailyForecast, DailyForecastResult } from './types.ts';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

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

export async function getWeather(latitude: number, longitude: number): Promise<number | null> {
  const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json() as ForecastResult;
    return data.current?.temperature_2m ?? null;
  } catch {
    return null;
  }
}

export async function getDailyForecast(latitude: number, longitude: number): Promise<DailyForecast[] | null> {
  const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json() as DailyForecastResult;
    const daily = data.daily;
    if (!daily?.time) return null;

    return daily.time.map((date, i) => ({
      date,
      tempMax: daily.temperature_2m_max?.[i] ?? null,
      tempMin: daily.temperature_2m_min?.[i] ?? null,
    }));
  } catch {
    return null;
  }
}

export function celsiusToFahrenheit(celsius: number): number {
  return Math.round(celsius * 9 / 5 + 32);
}

export function formatTemperature(celsius: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    return `${celsiusToFahrenheit(celsius)}°F`;
  }
  return `${celsius}°C`;
}

export function getCityDisplayName(city: GeocodingResult): string {
  const parts = [city.name];
  if (city.admin1) parts.push(city.admin1);
  if (city.country) parts.push(city.country);
  return parts.join(', ');
}