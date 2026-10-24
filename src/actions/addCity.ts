import type { AppState } from '../types/AppState.ts';
import type { City } from '../types/City.ts';
import { searchCity } from '../api/geocoding.ts';
import { getInput, pressEnterToContinue } from '../presentation/input.ts';
import { showError, showStatus, showSuccess } from '../presentation/output.ts';
import { addCity as addCityToCollection } from '../storage/citiesStorage.ts';
import { saveState } from '../storage/appStateStorage.ts';
import { getCityDisplayName } from '../utils/format.ts';

export async function addCity(state: AppState): Promise<void> {
  const name = await getInput('  Ingrese el nombre de la ciudad: ');
  if (!name) {
    showError('Nombre de ciudad requerido.');
    await pressEnterToContinue();
    return;
  }

  showStatus('Buscando ciudad...');
  const result = await searchCity(name);

  if (!result) {
    showError('Ciudad no encontrada.');
    await pressEnterToContinue();
    return;
  }

  const displayName = getCityDisplayName(result);
  const confirm = await getInput(`  ¿Agregar "${displayName}"? (s/n): `);

  if (confirm.toLowerCase() !== 's') {
    showError('Operación cancelada.');
    await pressEnterToContinue();
    return;
  }

  const newCity: City = {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    isDefault: state.cities.length === 0,
  };

  state.cities = addCityToCollection(state.cities, newCity);
  await saveState(state);

  showSuccess(`Ciudad "${result.name}" agregada correctamente.`);
  await pressEnterToContinue();
}
