export interface City {
  name: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

export interface WeatherData {
  temperature: number;
  unit: 'celsius' | 'fahrenheit';
}

export interface AppSettings {
  temperatureUnit: 'celsius' | 'fahrenheit';
}

export interface AppState {
  cities: City[];
  settings: AppSettings;
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface ForecastResult {
  current: {
    temperature_2m: number;
  };
}