import type { GeocodingResult } from '../types/Geocoding.ts';
import type { TemperatureUnit } from '../types/Weather.ts';

export function celsiusToFahrenheit(celsius: number): number {
  return Math.round(celsius * 9 / 5 + 32);
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
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

const forecastDateFormatter = new Intl.DateTimeFormat('es-ES', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

export function formatForecastDate(date: string): string {
  // Noon keeps the calendar date stable even if the runtime timezone differs from the city's
  return forecastDateFormatter.format(new Date(`${date}T12:00:00`));
}
