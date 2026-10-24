import type { AppState } from './types/AppState.ts';
import { isMenuOption } from './types/MenuOption.ts';
import { addCity } from './actions/addCity.ts';
import { showCityForecast } from './actions/getForecast.ts';
import { showAllCitiesWeather, showDefaultCityWeather } from './actions/getWeather.ts';
import { removeCity } from './actions/removeCity.ts';
import { setDefaultCity } from './actions/setDefaultCity.ts';
import { toggleTemperatureUnit } from './actions/toggleTemperatureUnit.ts';
import { getInput, inputExhausted, pressEnterToContinue } from './presentation/input.ts';
import { showMenu } from './presentation/menu.ts';
import { loadState } from './storage/appStateStorage.ts';
import { red, yellow } from './utils/colors.ts';

async function main(): Promise<void> {
  const state: AppState = await loadState();

  while (true) {
    if (inputExhausted()) {
      console.log(`\n  ${yellow('Entrada cerrada. Saliendo...')}\n`);
      process.exit(0);
    }

    showMenu(state);
    const choice = await getInput();

    if (!isMenuOption(choice)) {
      console.log(`\n  ${red('Opción inválida.')}\n`);
      await pressEnterToContinue();
      continue;
    }

    switch (choice) {
      case '1':
        await showDefaultCityWeather(state);
        break;
      case '2':
        await showAllCitiesWeather(state);
        break;
      case '3':
        await addCity(state);
        break;
      case '4':
        await removeCity(state);
        break;
      case '5':
        await setDefaultCity(state);
        break;
      case '6':
        await showCityForecast(state);
        break;
      case '8':
        await toggleTemperatureUnit(state);
        break;
      case '9':
        console.log('\n  ¡Hasta luego!\n');
        process.exit(0);
        break;
    }
  }
}

main().catch(console.error);
