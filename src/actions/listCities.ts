import type { City } from '../types/City.ts';
import { getInput, pressEnterToContinue } from '../presentation/input.ts';
import { showCityList, showError } from '../presentation/output.ts';

export function listCities(cities: City[]): void {
  showCityList(cities);
}

export async function selectCity(cities: City[], prompt: string): Promise<City | null> {
  listCities(cities);
  const input = await getInput(prompt);
  const index = parseInt(input, 10) - 1;

  if (isNaN(index) || index < 0 || index >= cities.length) {
    showError('Selección inválida.');
    await pressEnterToContinue();
    return null;
  }

  const city = cities[index];
  if (!city) {
    showError('Ciudad no encontrada.');
    await pressEnterToContinue();
    return null;
  }

  return city;
}
