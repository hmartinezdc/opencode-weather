import { afterEach, describe, expect, test } from 'bun:test';
import { searchCity } from '../../src/api/geocoding.ts';
import { fetchCon, fetchConCuerpo, fetchConEstado, fetchQueFalla } from '../helpers/fetchMock.ts';

const fetchOriginal = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = fetchOriginal;
});

describe('searchCity', () => {
  test('devuelve el primer resultado con la URL exacta', async () => {
    const fetchMock = fetchCon({
      results: [{ name: 'Madrid', latitude: 40.4168, longitude: -3.7038, country: 'España', admin1: 'Comunidad de Madrid' }],
    });

    const resultado = await searchCity('Madrid');

    expect(resultado).toEqual({
      name: 'Madrid',
      latitude: 40.4168,
      longitude: -3.7038,
      country: 'España',
      admin1: 'Comunidad de Madrid',
    });
    const llamada = fetchMock.mock.calls[0] ?? [];
    expect(String(llamada[0])).toBe(
      'https://geocoding-api.open-meteo.com/v1/search?name=Madrid&count=1&language=es&format=json',
    );
  });

  test('codifica el nombre en la URL', async () => {
    const fetchMock = fetchCon({ results: [{ name: 'El Bolsón', latitude: 1, longitude: 2 }] });

    await searchCity('El Bolsón');

    const llamada = fetchMock.mock.calls[0] ?? [];
    expect(String(llamada[0])).toContain('name=El%20Bols%C3%B3n');
  });

  test('devuelve null cuando no hay resultados', async () => {
    fetchCon({});
    expect(await searchCity('Ciudad Inexistente')).toBeNull();
  });

  test('devuelve null cuando la lista de resultados está vacía', async () => {
    fetchCon({ results: [] });
    expect(await searchCity('Ciudad Inexistente')).toBeNull();
  });

  test('devuelve null cuando el HTTP falla', async () => {
    fetchConEstado(404);
    expect(await searchCity('Madrid')).toBeNull();
  });

  test('devuelve null cuando el JSON no se puede parsear', async () => {
    fetchConCuerpo('no-es-json');
    expect(await searchCity('Madrid')).toBeNull();
  });

  test('devuelve null cuando falla la red', async () => {
    fetchQueFalla();
    expect(await searchCity('Madrid')).toBeNull();
  });
});
