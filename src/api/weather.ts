import type { DailyForecast, DailyForecastResult, ForecastResult } from '../types/Weather.ts';
import { FORECAST_DAYS, FORECAST_URL } from '../utils/constants.ts';

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
  const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=${FORECAST_DAYS}`;

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
