import type { AppState } from '../types/AppState.ts';
import { boldCyan, cyan } from '../utils/colors.ts';
import { TEMPERATURE_UNIT_LABELS, UI_BORDER, UI_TITLE } from '../utils/constants.ts';

export function clearScreen(): void {
  console.log('\x1b[2J\x1b[H');
}

export function showMenu(state: AppState): void {
  clearScreen();
  console.log(cyan(UI_BORDER));
  console.log(boldCyan(UI_TITLE));
  console.log(cyan(UI_BORDER));

  const defaultCity = state.cities.find(c => c.isDefault);
  const defaultLabel = defaultCity ? defaultCity.name : 'Sin ciudad';
  const unitLabel = TEMPERATURE_UNIT_LABELS[state.settings.temperatureUnit] ?? '°F';

  console.log(`  ${cyan('1.')} Clima de ciudad default ${cyan(`(${defaultLabel})`)}`);
  console.log(`  ${cyan('2.')} Clima de todas las ciudades ${cyan(`(${state.cities.length})`)}`);
  console.log(`  ${cyan('3.')} Buscar y agregar ciudad`);
  console.log(`  ${cyan('4.')} Eliminar ciudad`);
  console.log(`  ${cyan('5.')} Establecer ciudad default`);
  console.log(`  ${cyan('6.')} Pronóstico 7 días de una ciudad`);
  console.log(`  ${cyan('8.')} Ajustes ${cyan(`(${unitLabel})`)}`);
  console.log(`  ${cyan('9.')} Salir`);
  console.log(cyan(UI_BORDER));
  process.stdout.write(`  ${cyan('Selecciona una opción:')} `);
}
