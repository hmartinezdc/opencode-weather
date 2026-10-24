import { afterEach, describe, expect, test } from 'bun:test';
import { getDailyForecast, getWeather } from '../../src/api/weather.ts';
import { fetchCon, fetchConCuerpo, fetchConEstado, fetchQueFalla } from '../helpers/fetchMock.ts';

const fetchOriginal = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = fetchOriginal;
});

describe('getWeather', () => {
  test('devuelve la temperatura actual con la URL exacta', async () => {
    const fetchMock = fetchCon({ current: { temperature_2m: 21.5 } });

    const temperatura = await getWeather(40.4168, -3.7038);

    expect(temperatura).toBe(21.5);
    const llamada = fetchMock.mock.calls[0] ?? [];
    expect(String(llamada[0])).toBe(
      'https://api.open-meteo.com/v1/forecast?latitude=40.4168&longitude=-3.7038&current=temperature_2m',
    );
  });

  test('devuelve null cuando el HTTP falla', async () => {
    fetchConEstado(500);
    expect(await getWeather(40.4168, -3.7038)).toBeNull();
  });

  test('devuelve null cuando el JSON no se puede parsear', async () => {
    fetchConCuerpo('{ esto no es json');
    expect(await getWeather(40.4168, -3.7038)).toBeNull();
  });

  test('devuelve null cuando la respuesta no trae "current"', async () => {
    fetchCon({});
    expect(await getWeather(40.4168, -3.7038)).toBeNull();
  });

  test('devuelve null cuando falla la red', async () => {
    fetchQueFalla();
    expect(await getWeather(40.4168, -3.7038)).toBeNull();
  });
});

describe('getDailyForecast', () => {
  test('mapea los días con sus temperaturas máxima y mínima', async () => {
    fetchCon({
      daily: {
        time: ['2026-10-23', '2026-10-24'],
        temperature_2m_max: [18.3, 21.7],
        temperature_2m_min: [7.1, 9.4],
      },
    });

    const pronostico = await getDailyForecast(40.4168, -3.7038);

    expect(pronostico).toEqual([
      { date: '2026-10-23', tempMax: 18.3, tempMin: 7.1 },
      { date: '2026-10-24', tempMax: 21.7, tempMin: 9.4 },
    ]);
  });

  test('rellena con null los índices ausentes en los arrays de temperaturas', async () => {
    fetchCon({
      daily: {
        time: ['2026-10-23', '2026-10-24', '2026-10-25'],
        temperature_2m_max: [1.1, 2.2],
      },
    });

    const pronostico = await getDailyForecast(40.4168, -3.7038);

    expect(pronostico).toEqual([
      { date: '2026-10-23', tempMax: 1.1, tempMin: null },
      { date: '2026-10-24', tempMax: 2.2, tempMin: null },
      { date: '2026-10-25', tempMax: null, tempMin: null },
    ]);
  });

  test('usa la URL con daily, timezone y 7 días de pronóstico', async () => {
    const fetchMock = fetchCon({ daily: { time: [] } });

    await getDailyForecast(-34.61, -58.38);

    const llamada = fetchMock.mock.calls[0] ?? [];
    expect(String(llamada[0])).toBe(
      'https://api.open-meteo.com/v1/forecast?latitude=-34.61&longitude=-58.38'
        + '&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7',
    );
  });

  test('devuelve null cuando falta "daily"', async () => {
    fetchCon({});
    expect(await getDailyForecast(40.4168, -3.7038)).toBeNull();
  });

  test('devuelve null cuando falta "daily.time"', async () => {
    fetchCon({ daily: { temperature_2m_max: [20] } });
    expect(await getDailyForecast(40.4168, -3.7038)).toBeNull();
  });

  test('devuelve null cuando el HTTP falla', async () => {
    fetchConEstado(429);
    expect(await getDailyForecast(40.4168, -3.7038)).toBeNull();
  });

  test('devuelve null cuando el JSON no se puede parsear', async () => {
    fetchConCuerpo('</html>');
    expect(await getDailyForecast(40.4168, -3.7038)).toBeNull();
  });

  test('devuelve null cuando falla la red', async () => {
    fetchQueFalla();
    expect(await getDailyForecast(40.4168, -3.7038)).toBeNull();
  });
});
