import type { TemperatureUnit } from '../types/Weather.ts';

export const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
export const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
export const FORECAST_DAYS = 7;

export const TEMPERATURE_UNIT_LABELS: Record<TemperatureUnit, string> = {
  celsius: '°C',
  fahrenheit: '°F',
};

export const UI_BORDER = '═'.repeat(42);
export const UI_TITLE = '          WEATHER CLI';
