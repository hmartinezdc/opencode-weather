import type { City } from '../types/City.ts';

export function getDefaultCity(cities: City[]): City | undefined {
  return cities.find(c => c.isDefault);
}

export function setDefaultCity(cities: City[], name: string): City[] {
  return cities.map(c => ({
    ...c,
    isDefault: c.name.toLowerCase() === name.toLowerCase(),
  }));
}

export function addCity(cities: City[], city: City): City[] {
  const exists = cities.some(c =>
    c.name.toLowerCase() === city.name.toLowerCase()
  );
  if (exists) return cities;

  const newCities = [...cities, city];
  if (newCities.length === 1 && newCities[0]) {
    newCities[0].isDefault = true;
  }
  return newCities;
}

export function removeCity(cities: City[], name: string): City[] {
  return cities.filter(c => c.name.toLowerCase() !== name.toLowerCase());
}

export function normalizeCities(value: unknown): City[] {
  return Array.isArray(value) ? value as City[] : [];
}
