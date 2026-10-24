import type { AppState } from '../types/AppState.ts';
import { getDailyForecast, getWeather } from '../api/weather.ts';
import { pressEnterToContinue } from '../presentation/input.ts';
import { showError, showForecast, showInfo, showWeather } from '../presentation/output.ts';
import { getDefaultCity } from '../storage/citiesStorage.ts';

export async function showDefaultCityWeather(state: AppState): Promise<void> {
  const defaultCity = getDefaultCity(state.cities);
  if (!defaultCity) {
    showError('No hay ciudad default configurada. Use la opción 3 o 5.');
    await pressEnterToContinue();
    return;
  }

  const [temp, forecast] = await Promise.all([
    getWeather(defaultCity.latitude, defaultCity.longitude),
    getDailyForecast(defaultCity.latitude, defaultCity.longitude),
  ]);

  if (temp === null) {
    showError('No se pudo obtener el clima.');
    await pressEnterToContinue();
    return;
  }

  showWeather(defaultCity.name, temp, state.settings.temperatureUnit);

  if (forecast) {
    showForecast(defaultCity.name, forecast, state.settings.temperatureUnit);
  } else {
    showError('No se pudo obtener el pronóstico.');
  }

  await pressEnterToContinue();
}

export async function showAllCitiesWeather(state: AppState): Promise<void> {
  if (state.cities.length === 0) {
    showError('No hay ciudades guardadas.');
    await pressEnterToContinue();
    return;
  }

  showInfo('Obteniendo clima de todas las ciudades...');

  for (const city of state.cities) {
    const temp = await getWeather(city.latitude, city.longitude);
    if (temp !== null) {
      showWeather(city.name, temp, state.settings.temperatureUnit);
    } else {
      showError(`No se pudo obtener el clima para ${city.name}`);
    }
  }

  await pressEnterToContinue();
}
