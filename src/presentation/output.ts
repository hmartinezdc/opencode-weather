import type { City } from '../types/City.ts';
import type { DailyForecast, TemperatureUnit } from '../types/Weather.ts';
import { cyan, green, red, yellow } from '../utils/colors.ts';
import { UI_BORDER } from '../utils/constants.ts';
import { formatForecastDate, formatTemperature } from '../utils/format.ts';

export function showWeather(cityName: string, temperature: number, unit: TemperatureUnit): void {
  console.log(`\n  Clima en ${cyan(cityName)}: ${yellow(formatTemperature(temperature, unit))}\n`);
}

export function showForecast(cityName: string, days: DailyForecast[], unit: TemperatureUnit): void {
  console.log(`\n  ${cyan(`Pronóstico 7 días en ${cityName}:`)}`);
  console.log(`  ${cyan(UI_BORDER)}`);

  days.forEach((day) => {
    const label = formatForecastDate(day.date);
    const max = day.tempMax === null ? '—' : formatTemperature(day.tempMax, unit);
    const min = day.tempMin === null ? '—' : formatTemperature(day.tempMin, unit);
    console.log(`  ${label.padEnd(12)}${yellow(max)} / ${cyan(min)}`);
  });

  console.log();
}

export function showError(message: string): void {
  console.log(`\n  ${red('Error:')} ${message}\n`);
}

export function showSuccess(message: string): void {
  console.log(`\n  ${green(message)}\n`);
}

export function showInfo(message: string): void {
  console.log(`\n  ${cyan(message)}\n`);
}

export function showStatus(message: string): void {
  console.log(`  ${cyan(message)}`);
}

export function showCityList(cities: City[]): void {
  if (cities.length === 0) {
    console.log(`\n  ${yellow('No hay ciudades guardadas.')}\n`);
    return;
  }

  console.log(`\n  ${cyan('Ciudades guardadas:')}`);
  cities.forEach((city, index) => {
    const defaultMark = city.isDefault ? ' ★' : '';
    console.log(`    ${cyan(`${index + 1}.`)} ${city.name}${yellow(defaultMark)}`);
  });
  console.log();
}
