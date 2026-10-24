import type { AppState } from '../types/AppState.ts';
import { pressEnterToContinue } from '../presentation/input.ts';
import { showError, showSuccess } from '../presentation/output.ts';
import { setDefaultCity as setDefaultCityInCollection } from '../storage/citiesStorage.ts';
import { saveState } from '../storage/appStateStorage.ts';
import { selectCity } from './listCities.ts';

export async function setDefaultCity(state: AppState): Promise<void> {
  if (state.cities.length === 0) {
    showError('No hay ciudades guardadas.');
    await pressEnterToContinue();
    return;
  }

  const city = await selectCity(
    state.cities,
    '  Seleccione el número de la ciudad default: '
  );
  if (!city) return;

  state.cities = setDefaultCityInCollection(state.cities, city.name);
  await saveState(state);

  showSuccess(`"${city.name}" establecida como ciudad default.`);
  await pressEnterToContinue();
}
