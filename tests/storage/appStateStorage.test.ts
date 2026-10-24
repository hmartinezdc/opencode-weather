import { afterAll, afterEach, describe, expect, mock, test } from 'bun:test';
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import * as osReal from 'node:os';
import { join } from 'node:path';
import type { AppState } from '../../src/types/AppState.ts';
import type { City } from '../../src/types/City.ts';
import type { AppSettings } from '../../src/types/Settings.ts';

const directorioBaseReal = osReal.tmpdir();
const directorioTemporal = await mkdtemp(join(directorioBaseReal, 'weather-cli-test-'));

// El módulo calcula STORAGE_DIR con homedir() al cargarse: hay que mockear
// 'node:os' ANTES de importarlo dinámicamente, para que escriba en nuestro
// directorio temporal y no en ~/.weather-cli real.
mock.module('node:os', () => ({
  ...osReal,
  homedir: () => directorioTemporal,
}));

// Importación dinámica DESPUÉS del mock (el módulo ya queda en caché con la ruta temporal)
const { loadState, saveState } = await import('../../src/storage/appStateStorage.ts');

const DIR_DATOS = join(directorioTemporal, '.weather-cli');
const ARCHIVO_DATOS = join(DIR_DATOS, 'data.json');

afterAll(async () => {
  await rm(directorioTemporal, { recursive: true, force: true });
});

afterEach(async () => {
  await rm(DIR_DATOS, { recursive: true, force: true });
});

function ciudad(nombre: string, isDefault = false): City {
  return { name: nombre, latitude: 40.4, longitude: -3.7, isDefault };
}

describe('loadState', () => {
  test('devuelve los valores por defecto cuando no hay archivo', async () => {
    const estado = await loadState();

    expect(estado).toEqual({
      cities: [],
      settings: { temperatureUnit: 'celsius' },
    });
  });

  test('devuelve los valores por defecto si el JSON está corrupto', async () => {
    await mkdir(DIR_DATOS, { recursive: true });
    await writeFile(ARCHIVO_DATOS, '{ esto no es json', 'utf-8');

    const estado = await loadState();

    expect(estado).toEqual({
      cities: [],
      settings: { temperatureUnit: 'celsius' },
    });
  });

  test('normaliza cities cuando no es un array y settings cuando no es objeto', async () => {
    await mkdir(DIR_DATOS, { recursive: true });
    await writeFile(ARCHIVO_DATOS, JSON.stringify({ cities: 42, settings: 'lo que sea' }), 'utf-8');

    const estado = await loadState();

    expect(estado.cities).toEqual([]);
    expect(estado.settings).toEqual({ temperatureUnit: 'celsius' });
  });
});

describe('saveState + loadState', () => {
  test('hace un round-trip completo del estado', async () => {
    const estado: AppState = {
      cities: [ciudad('Madrid', true), ciudad('Boston', false)],
      settings: { temperatureUnit: 'fahrenheit' },
    };

    await saveState(estado);

    const cargado = await loadState();
    expect(cargado).toEqual(estado);
  });

  test('escribe JSON legible en el archivo definitivo sin dejar temporales', async () => {
    const estado: AppState = {
      cities: [ciudad('Madrid', true)],
      settings: { temperatureUnit: 'celsius' },
    };

    await saveState(estado);

    const archivos = await readdir(DIR_DATOS);
    expect(archivos).toEqual(['data.json']); // el .tmp se renombró: sin residuos

    const contenido = JSON.parse(await readFile(ARCHIVO_DATOS, 'utf-8')) as {
      cities: City[];
      settings: AppSettings;
    };
    expect(contenido.cities).toEqual([{ name: 'Madrid', latitude: 40.4, longitude: -3.7, isDefault: true }]);
  });

  test('crea el directorio de storage si no existe', async () => {
    // afterEach elimina ~/.weather-cli por completo; saveState debe recrearlo solo
    await saveState({
      cities: [],
      settings: { temperatureUnit: 'celsius' },
    });

    const estado = await loadState();
    // round-trip con lista vacía: solo importa que exista y sea válida
    expect(estado).toEqual({
      cities: [],
      settings: { temperatureUnit: 'celsius' },
    });
  });
});
