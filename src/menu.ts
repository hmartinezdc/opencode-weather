import type { AppState, City } from './types.ts';
import { cyan, green, red, yellow, boldCyan } from './colors.ts';
import { createInterface } from 'node:readline';

let inputBuffer: string[] = [];
let waitingResolve: ((value: string) => void) | null = null;
let inputEnded = false;

const rl = createInterface({ input: process.stdin });

rl.on('line', (line) => {
  if (waitingResolve) {
    const resolve = waitingResolve;
    waitingResolve = null;
    resolve(line);
  } else {
    inputBuffer.push(line);
  }
});

rl.on('close', () => {
  inputEnded = true;
  if (waitingResolve) {
    const resolve = waitingResolve;
    waitingResolve = null;
    resolve('');
  }
});

const BORDER = '═'.repeat(42);
const TITLE = '          WEATHER CLI';

export function clearScreen(): void {
  console.log('\x1b[2J\x1b[H');
}

export function showMenu(state: AppState): void {
  clearScreen();
  console.log(cyan(BORDER));
  console.log(boldCyan(TITLE));
  console.log(cyan(BORDER));
  
  const defaultCity = state.cities.find(c => c.isDefault);
  const defaultLabel = defaultCity ? defaultCity.name : 'Sin ciudad';
  const unitLabel = state.settings.temperatureUnit === 'celsius' ? '°C' : '°F';
  
  console.log(`  ${cyan('1.')} Clima de ciudad default ${cyan(`(${defaultLabel})`)}`);
  console.log(`  ${cyan('2.')} Clima de todas las ciudades ${cyan(`(${state.cities.length})`)}`);
  console.log(`  ${cyan('3.')} Buscar y agregar ciudad`);
  console.log(`  ${cyan('4.')} Eliminar ciudad`);
  console.log(`  ${cyan('5.')} Establecer ciudad default`);
  console.log(`  ${cyan('8.')} Ajustes ${cyan(`(${unitLabel})`)}`);
  console.log(`  ${cyan('9.')} Salir`);
  console.log(cyan(BORDER));
  process.stdout.write(`  ${cyan('Selecciona una opción:')} `);
}

export function showWeather(cityName: string, temperature: number, unit: 'celsius' | 'fahrenheit'): void {
  const displayTemp = unit === 'fahrenheit' 
    ? Math.round(temperature * 9 / 5 + 32) + '°F'
    : temperature + '°C';
  console.log(`\n  Clima en ${cyan(cityName)}: ${yellow(displayTemp)}\n`);
}

export function showError(message: string): void {
  console.log(`\n  ${red('Error:')} ${message}\n`);
}

export function showSuccess(message: string): void {
  console.log(`\n  ${green(message)}\n`);
}

export function listCities(cities: City[]): void {
  if (cities.length === 0) {
    console.log(`\n  ${yellow('No hay ciudades guardadas.')}\n`);
    return;
  }
  
  console.log(`\n  ${cyan('Ciudades guardadas:')}`);
  cities.forEach((city, index) => {
    const defaultMark = city.isDefault ? ' ★' : '';
    console.log(`    ${cyan(`${index + 1}.`)} ${city.name}${yellow(defaultMark)}`);
  });
  console.log();
}

export async function getInput(promptText = ''): Promise<string> {
  if (promptText) process.stdout.write(promptText);

  return new Promise((resolve) => {
    if (inputBuffer.length > 0) {
      resolve(inputBuffer.shift() ?? '');
      return;
    }
    if (inputEnded) {
      resolve('');
      return;
    }
    waitingResolve = resolve;
  });
}

export async function pressEnterToContinue(): Promise<void> {
  await getInput('  Presiona Enter para continuar...');
}