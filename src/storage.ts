import type { AppState, AppSettings, City } from './types.ts';
import { mkdir, writeFile, rename, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const STORAGE_DIR = join(homedir(), '.weather-cli');
const STORAGE_FILE = join(STORAGE_DIR, 'data.json');

const DEFAULT_SETTINGS: AppSettings = {
  temperatureUnit: 'celsius',
};

const DEFAULT_STATE: AppState = {
  cities: [],
  settings: DEFAULT_SETTINGS,
};

async function ensureStorageDir(): Promise<void> {
  if (!existsSync(STORAGE_DIR)) {
    await mkdir(STORAGE_DIR, { recursive: true });
  }
}

export async function loadState(): Promise<AppState> {
  await ensureStorageDir();
  
  try {
    if (existsSync(STORAGE_FILE)) {
      const data = JSON.parse(await readFile(STORAGE_FILE, 'utf-8')) as AppState;
      return {
        cities: data.cities || [],
        settings: data.settings || DEFAULT_SETTINGS,
      };
    }
  } catch {
    // Ignore errors, return defaults
  }
  
  return DEFAULT_STATE;
}

export async function saveState(state: AppState): Promise<void> {
  await ensureStorageDir();
  const tempFile = `${STORAGE_FILE}.tmp`;
  await writeFile(tempFile, JSON.stringify(state, null, 2));
  await rename(tempFile, STORAGE_FILE);
}

export function getDefaultCity(cities: City[]): City | undefined {
  return cities.find(c => c.isDefault);
}

export function setDefaultCity(cities: City[], name: string): City[] {
  return cities.map(c => ({
    ...c,
    isDefault: c.name.toLowerCase() === name.toLowerCase(),
  }));
}

export function addCity(cities: City[], city: City): City[] {
  const exists = cities.some(c => 
    c.name.toLowerCase() === city.name.toLowerCase()
  );
  if (exists) return cities;
  
  const newCities = [...cities, city];
  if (newCities.length === 1 && newCities[0]) {
    newCities[0].isDefault = true;
  }
  return newCities;
}

export function removeCity(cities: City[], name: string): City[] {
  return cities.filter(c => c.name.toLowerCase() !== name.toLowerCase());
}