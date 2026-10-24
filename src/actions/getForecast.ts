import type { AppState } from '../types/AppState.ts';
import { getDailyForecast } from '../api/weather.ts';
import { pressEnterToContinue } from '../presentation/input.ts';
import { showError, showForecast, showStatus } from '../presentation/output.ts';
import { selectCity } from './listCities.ts';

export async function showCityForecast(state: AppState): Promise<void> {
  if (state.cities.length === 0) {
    showError('No hay ciudades guardadas.');
    await pressEnterToContinue();
    return;
  }

  const city = await selectCity(
    state.cities,
    '  Seleccione el número de la ciudad: '
  );
  if (!city) return;

  showStatus('Obteniendo pronóstico...');
  const forecast = await getDailyForecast(city.latitude, city.longitude);

  if (!forecast) {
    showError('No se pudo obtener el pronóstico.');
    await pressEnterToContinue();
    return;
  }

  showForecast(city.name, forecast, state.settings.temperatureUnit);
  await pressEnterToContinue();
}
