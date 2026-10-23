import type { AppState, City, GeocodingResult } from './types.ts';
import { searchCity, getWeather, getDailyForecast, getCityDisplayName } from './api.ts';
import { 
  loadState, 
  saveState, 
  getDefaultCity, 
  setDefaultCity, 
  addCity, 
  removeCity 
} from './storage.ts';
import { 
  showMenu, 
  showWeather, 
  showForecast,
  showError, 
  showSuccess, 
  listCities, 
  getInput, 
  pressEnterToContinue 
} from './menu.ts';
import { cyan } from './colors.ts';

export async function handleOption1(state: AppState): Promise<void> {
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

export async function handleOption2(state: AppState): Promise<void> {
  if (state.cities.length === 0) {
    showError('No hay ciudades guardadas.');
    await pressEnterToContinue();
    return;
  }
  
  console.log(`\n  ${cyan('Obteniendo clima de todas las ciudades...')}\n`);
  
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

export async function handleOption3(state: AppState): Promise<void> {
  const name = await getInput('  Ingrese el nombre de la ciudad: ');
  if (!name) {
    showError('Nombre de ciudad requerido.');
    await pressEnterToContinue();
    return;
  }
  
  console.log(`  ${cyan('Buscando ciudad...')}`);
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
  
  state.cities = addCity(state.cities, newCity);
  await saveState(state);
  
  showSuccess(`Ciudad "${result.name}" agregada correctamente.`);
  await pressEnterToContinue();
}

export async function handleOption6(state: AppState): Promise<void> {
  if (state.cities.length === 0) {
    showError('No hay ciudades guardadas.');
    await pressEnterToContinue();
    return;
  }

  listCities(state.cities);
  const input = await getInput('  Seleccione el número de la ciudad: ');
  const index = parseInt(input, 10) - 1;

  if (isNaN(index) || index < 0 || index >= state.cities.length) {
    showError('Selección inválida.');
    await pressEnterToContinue();
    return;
  }

  const city = state.cities[index];
  if (!city) {
    showError('Ciudad no encontrada.');
    await pressEnterToContinue();
    return;
  }

  console.log(`  ${cyan('Obteniendo pronóstico...')}`);
  const forecast = await getDailyForecast(city.latitude, city.longitude);

  if (!forecast) {
    showError('No se pudo obtener el pronóstico.');
    await pressEnterToContinue();
    return;
  }

  showForecast(city.name, forecast, state.settings.temperatureUnit);
  await pressEnterToContinue();
}

export async function handleOption4(state: AppState): Promise<void> {
  if (state.cities.length === 0) {
    showError('No hay ciudades para eliminar.');
    await pressEnterToContinue();
    return;
  }
  
  listCities(state.cities);
  const input = await getInput('  Seleccione el número de la ciudad a eliminar: ');
  const index = parseInt(input, 10) - 1;
  
  if (isNaN(index) || index < 0 || index >= state.cities.length) {
    showError('Selección inválida.');
    await pressEnterToContinue();
    return;
  }
  
  const cityToRemove = state.cities[index];
  if (!cityToRemove) {
    showError('Ciudad no encontrada.');
    await pressEnterToContinue();
    return;
  }
  
  const confirm = await getInput(`  ¿Eliminar "${cityToRemove.name}"? (s/n): `);
  
  if (confirm.toLowerCase() !== 's') {
    showError('Operación cancelada.');
    await pressEnterToContinue();
    return;
  }
  
  state.cities = removeCity(state.cities, cityToRemove.name);
  await saveState(state);
  
  showSuccess(`Ciudad "${cityToRemove.name}" eliminada.`);
  await pressEnterToContinue();
}

export async function handleOption5(state: AppState): Promise<void> {
  if (state.cities.length === 0) {
    showError('No hay ciudades guardadas.');
    await pressEnterToContinue();
    return;
  }
  
  listCities(state.cities);
  const input = await getInput('  Seleccione el número de la ciudad default: ');
  const index = parseInt(input, 10) - 1;
  
  if (isNaN(index) || index < 0 || index >= state.cities.length) {
    showError('Selección inválida.');
    await pressEnterToContinue();
    return;
  }
  
  const city = state.cities[index];
  if (!city) {
    showError('Ciudad no encontrada.');
    await pressEnterToContinue();
    return;
  }
  
  state.cities = setDefaultCity(state.cities, city.name);
  await saveState(state);
  
  showSuccess(`"${city.name}" establecida como ciudad default.`);
  await pressEnterToContinue();
}