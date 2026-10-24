import { describe, expect, test } from 'bun:test';
import {
  addCity,
  getDefaultCity,
  normalizeCities,
  removeCity,
  setDefaultCity,
} from '../../src/storage/citiesStorage.ts';
import type { City } from '../../src/types/City.ts';

function ciudad(nombre: string, isDefault = false): City {
  return { name: nombre, latitude: 10.5, longitude: -20.3, isDefault };
}

describe('getDefaultCity', () => {
  test('devuelve la ciudad marcada como predeterminada', () => {
    const ciudades = [ciudad('Madrid', false), ciudad('Boston', true)];
    expect(getDefaultCity(ciudades)?.name).toBe('Boston');
  });

  test('devuelve undefined si ninguna city está marcada', () => {
    expect(getDefaultCity([ciudad('Madrid', false)])).toBeUndefined();
  });

  test('devuelve undefined con la lista vacía', () => {
    expect(getDefaultCity([])).toBeUndefined();
  });
});

describe('addCity', () => {
  test('la primera ciudad añadida se convierte en la predeterminada', () => {
    const nueva = { name: 'Madrid', latitude: 40.4, longitude: -3.7, isDefault: false };

    const resultado = addCity([], nueva);

    // ojo: la implementación muta el objeto original cuando es la primera ciudad
    expect(resultado).toEqual([{ name: 'Madrid', latitude: 40.4, longitude: -3.7, isDefault: true }]);
    expect(nueva.isDefault).toBe(true);
  });

  test('las siguientes ciudades no alteran la predeterminada', () => {
    const primera = ciudad('Madrid', true);
    const segunda = ciudad('Boston', false);

    const resultado = addCity([primera], segunda);

    expect(resultado).toEqual([primera, segunda]);
    expect(segunda.isDefault).toBe(false);
  });

  test('no duplica aunque cambien las mayúsculas/minúsculas', () => {
    const ciudades = [ciudad('Madrid', true), ciudad('Boston', false)];

    const resultado = addCity(ciudades, ciudad('mAdRiD'));

    expect(resultado).toBe(ciudades); // devuelto sin tocar: la referencia original
    expect(resultado).toHaveLength(2);
  });
});

describe('setDefaultCity', () => {
  test('marca la ciudad pedida y desmarca las demás (sin distinguir mayúsculas)', () => {
    const ciudades = [ciudad('Madrid', true), ciudad('Boston', false)];

    const resultado = setDefaultCity(ciudades, 'bOsToN');

    expect(resultado.map((c) => ({ name: c.name, isDefault: c.isDefault }))).toEqual([
      { name: 'Madrid', isDefault: false },
      { name: 'Boston', isDefault: true },
    ]);
    // el array original no muta
    expect(ciudades[0]?.isDefault).toBe(true);
  });

  test('un nombre desconocido desmarca todas', () => {
    const ciudades = [ciudad('Madrid', true), ciudad('Boston', false)];

    const resultado = setDefaultCity(ciudades, 'Tokio');

    expect(resultado.map((c) => c.isDefault)).toEqual([false, false]);
  });
});

describe('removeCity', () => {
  test('elimina la ciudad pedida sin distinguir mayúsculas', () => {
    const ciudades = [ciudad('Madrid', true), ciudad('Boston', false)];

    const resultado = removeCity(ciudades, 'bOsToN');

    expect(resultado).toEqual([ciudad('Madrid', true)]);
    expect(ciudades).toHaveLength(2); // original intacto
  });

  test('un nombre desconocido no elimina nada', () => {
    const ciudades = [ciudad('Madrid', true), ciudad('Boston', false)];
    expect(removeCity(ciudades, 'Tokio')).toHaveLength(2);
  });
});

describe('normalizeCities', () => {
  test('un array válido pasa tal cual', () => {
    const originales = [ciudad('Madrid', true)];
    expect(normalizeCities(originales)).toEqual(originales);
  });

  test('todo lo que no sea array se convierte en lista vacía', () => {
    expect(normalizeCities(undefined)).toEqual([]);
    expect(normalizeCities(null)).toEqual([]);
    expect(normalizeCities('Madrid')).toEqual([]);
    expect(normalizeCities(42)).toEqual([]);
    expect(normalizeCities({ name: 'Madrid' })).toEqual([]);
  });
});
