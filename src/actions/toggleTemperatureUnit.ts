import type { AppState } from '../types/AppState.ts';
import type { TemperatureUnit } from '../types/Weather.ts';
import { getInput, pressEnterToContinue } from '../presentation/input.ts';
import { showSuccess } from '../presentation/output.ts';
import { saveState } from '../storage/appStateStorage.ts';
import { TEMPERATURE_UNIT_LABELS } from '../utils/constants.ts';

export async function toggleTemperatureUnit(state: AppState): Promise<void> {
  const current = state.settings.temperatureUnit;
  const newUnit: TemperatureUnit = current === 'celsius' ? 'fahrenheit' : 'celsius';

  const currentLabel = TEMPERATURE_UNIT_LABELS[current] ?? '°F';
  const newLabel = TEMPERATURE_UNIT_LABELS[newUnit];

  const confirm = await getInput(
    `  Unidades actuales: ${currentLabel}. Cambiar a ${newLabel}? (s/n): `
  );

  if (confirm.toLowerCase() !== 's') {
    return;
  }

  state.settings.temperatureUnit = newUnit;
  await saveState(state);

  showSuccess(`Unidades cambiadas a ${newLabel}.`);
  await pressEnterToContinue();
}
