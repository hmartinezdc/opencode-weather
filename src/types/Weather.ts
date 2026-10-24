export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface WeatherData {
  temperature: number;
  unit: TemperatureUnit;
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
