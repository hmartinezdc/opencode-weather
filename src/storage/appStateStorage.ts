import type { AppState } from '../types/AppState.ts';
import { mkdir, writeFile, rename, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { normalizeCities } from './citiesStorage.ts';
import { DEFAULT_SETTINGS, normalizeSettings } from './settingsStorage.ts';

const STORAGE_DIR = join(homedir(), '.weather-cli');
const STORAGE_FILE = join(STORAGE_DIR, 'data.json');

async function ensureStorageDir(): Promise<void> {
  if (!existsSync(STORAGE_DIR)) {
    await mkdir(STORAGE_DIR, { recursive: true });
  }
}

export async function loadState(): Promise<AppState> {
  await ensureStorageDir();

  try {
    if (existsSync(STORAGE_FILE)) {
      const data = JSON.parse(await readFile(STORAGE_FILE, 'utf-8')) as Partial<AppState>;
      return {
        cities: normalizeCities(data.cities),
        settings: normalizeSettings(data.settings),
      };
    }
  } catch {
    // Ignore errors, return defaults
  }

  return {
    cities: [],
    settings: { ...DEFAULT_SETTINGS },
  };
}

export async function saveState(state: AppState): Promise<void> {
  await ensureStorageDir();
  const tempFile = `${STORAGE_FILE}.tmp`;
  await writeFile(tempFile, JSON.stringify(state, null, 2));
  await rename(tempFile, STORAGE_FILE);
}
