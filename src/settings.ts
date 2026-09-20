import type { AppState } from './types.ts';
import { saveState } from './storage.ts';
import { showSuccess, getInput, pressEnterToContinue } from './menu.ts';

export async function handleOption8(state: AppState): Promise<void> {
  const current = state.settings.temperatureUnit;
  const newUnit = current === 'celsius' ? 'fahrenheit' : 'celsius';
  
  const confirm = await getInput(
    `  Unidades actuales: ${current === 'celsius' ? '°C' : '°F'}. Cambiar a ${newUnit === 'celsius' ? '°C' : '°F'}? (s/n): `
  );
  
  if (confirm.toLowerCase() !== 's') {
    return;
  }
  
  state.settings.temperatureUnit = newUnit;
  await saveState(state);
  
  showSuccess(`Unidades cambiadas a ${newUnit === 'celsius' ? '°C' : '°F'}.`);
  await pressEnterToContinue();
}