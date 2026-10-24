import { describe, expect, test } from 'bun:test';
import { DEFAULT_SETTINGS, normalizeSettings } from '../../src/storage/settingsStorage.ts';

describe('normalizeSettings', () => {
  test('usa los valores por defecto con valores inválidos o ausentes', () => {
    expect(normalizeSettings(undefined)).toEqual({ temperatureUnit: 'celsius' });
    expect(normalizeSettings(null)).toEqual({ temperatureUnit: 'celsius' });
    expect(normalizeSettings('celsius')).toEqual({ temperatureUnit: 'celsius' });
    expect(normalizeSettings(0)).toEqual({ temperatureUnit: 'celsius' });
  });

  test('conserva la unidad guardada en un objeto válido', () => {
    expect(normalizeSettings({ temperatureUnit: 'fahrenheit' })).toEqual({ temperatureUnit: 'fahrenheit' });
  });

  test('cada llamada devuelve un objeto nuevo (no comparte referencia con DEFAULT_SETTINGS)', () => {
    const resultado = normalizeSettings(undefined);
    expect(resultado).toEqual(DEFAULT_SETTINGS);
    expect(resultado).not.toBe(DEFAULT_SETTINGS);
  });
});
