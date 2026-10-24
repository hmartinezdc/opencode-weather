import { describe, expect, test } from 'bun:test';
import {
  celsiusToFahrenheit,
  formatForecastDate,
  formatTemperature,
  getCityDisplayName,
} from '../../src/utils/format.ts';
import type { GeocodingResult } from '../../src/types/Geocoding.ts';

describe('celsiusToFahrenheit', () => {
  test('convierte los valores de congelación, ebullición y cruce con °F', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });

  test('redondea al entero más cercano', () => {
    // 21.5 °C = 70.7 °F → 71
    expect(celsiusToFahrenheit(21.5)).toBe(71);
    // -18.3 °C = -0.94 °F → -1 (Math.round hacia el entero más cercano)
    expect(celsiusToFahrenheit(-18.3)).toBe(-1);
  });
});

describe('formatTemperature', () => {
  test('formato celsius con símbolo °C', () => {
    expect(formatTemperature(25, 'celsius')).toBe('25°C');
  });

  test('formato fahrenheit convierte la temperatura y usa el símbolo °F', () => {
    expect(formatTemperature(25, 'fahrenheit')).toBe('77°F');
    expect(formatTemperature(0, 'fahrenheit')).toBe('32°F');
  });
});

describe('getCityDisplayName', () => {
  test('une los tres campos cuando todos están presentes', () => {
    const ciudad: GeocodingResult = { name: 'Madrid', latitude: 40, longitude: -3, admin1: 'Comunidad de Madrid', country: 'España' };
    expect(getCityDisplayName(ciudad)).toBe('Madrid, Comunidad de Madrid, España');
  });

  test('omite admin1 si no existe', () => {
    const ciudad: GeocodingResult = { name: 'Boston', latitude: 42, longitude: -71, country: 'United States' };
    expect(getCityDisplayName(ciudad)).toBe('Boston, United States');
  });

  test('omite país si no existe', () => {
    const ciudad: GeocodingResult = { name: 'Madrid', latitude: 40, longitude: -3 };
    expect(getCityDisplayName(ciudad)).toBe('Madrid');
  });
});

describe('formatForecastDate', () => {
  // Valores fijados con el formateador real ('es-ES', es-ES weekday/day/month short, mediodía local)
  test('formatea la fecha con día de la semana, día y mes abreviados', () => {
    expect(formatForecastDate('2026-10-23')).toBe('vie, 23 oct');
    expect(formatForecastDate('2026-01-05')).toBe('lun, 5 ene');
  });
});
