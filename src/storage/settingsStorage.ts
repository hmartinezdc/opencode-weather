import type { AppSettings } from '../types/Settings.ts';

export const DEFAULT_SETTINGS: AppSettings = {
  temperatureUnit: 'celsius',
};

export function normalizeSettings(value: unknown): AppSettings {
  if (!value || typeof value !== 'object') {
    return { ...DEFAULT_SETTINGS };
  }

  return {
    ...DEFAULT_SETTINGS,
    ...(value as Partial<AppSettings>),
  };
}
