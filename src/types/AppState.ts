import type { City } from './City.ts';
import type { AppSettings } from './Settings.ts';

export interface AppState {
  cities: City[];
  settings: AppSettings;
}
