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

export interface DailyForecast {
  date: string;
  tempMax: number | null;
  tempMin: number | null;
}

export interface DailyForecastResult {
  daily?: {
    time?: string[];
    temperature_2m_max?: (number | null)[];
    temperature_2m_min?: (number | null)[];
  };
}