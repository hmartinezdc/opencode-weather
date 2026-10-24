import type { AppState } from '../types/AppState.ts';
import { getInput, pressEnterToContinue } from '../presentation/input.ts';
import { showError, showSuccess } from '../presentation/output.ts';
import { removeCity as removeCityFromCollection } from '../storage/citiesStorage.ts';
import { saveState } from '../storage/appStateStorage.ts';
import { selectCity } from './listCities.ts';

export async function removeCity(state: AppState): Promise<void> {
  if (state.cities.length === 0) {
    showError('No hay ciudades para eliminar.');
    await pressEnterToContinue();
    return;
  }

  const cityToRemove = await selectCity(
    state.cities,
    '  Seleccione el número de la ciudad a eliminar: '
  );
  if (!cityToRemove) return;

  const confirm = await getInput(`  ¿Eliminar "${cityToRemove.name}"? (s/n): `);

  if (confirm.toLowerCase() !== 's') {
    showError('Operación cancelada.');
    await pressEnterToContinue();
    return;
  }

  state.cities = removeCityFromCollection(state.cities, cityToRemove.name);
  await saveState(state);

  showSuccess(`Ciudad "${cityToRemove.name}" eliminada.`);
  await pressEnterToContinue();
}
