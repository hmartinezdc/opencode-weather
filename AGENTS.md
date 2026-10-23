# AGENTS.md - 02-Weather

## Overview
Weather CLI in **Bun + TypeScript** (strict). Menú interactivo en español que consulta OpenMeteo y compila a un binario único. Funcional: no es un scaffold.

## Commands
```bash
bun install                    # deps
bun run dev                    # run with --watch
bun run typecheck              # bunx tsc --noEmit (TS is peer dep — run via bunx)
bun run build                  # emits weather.exe (gitignored artifact)
```
No tests exist.

## Hard rules
- **Imports must use explicit `.ts` extensions** (`./src/types.ts`): `moduleResolution: bundler` + `allowImportingTsExtensions`. Omitting the extension fails typecheck.
- All user-facing strings are **Spanish**.
- `src/api.ts` functions return **`null` on any failure** (HTTP error, bad JSON, no results) — callers must handle `null`, never throw-based error handling.

## Architecture
- `index.ts` — menu loop; loads state once, mutates it in place, persists via `saveState`.
- `src/cities.ts` — handlers for menu options 1–5; `src/settings.ts` handles option 8.
- `src/menu.ts` — readline-based stdin with queued input buffer; every terminal screen ends with `pressEnterToContinue()`.
- `src/storage.ts` / `src/api.ts` / `src/colors.ts` — state, OpenMeteo calls, ANSI helpers.

## Gotchas
- State lives at **`~/.weather-cli/data.json`**, not in the repo. Writes are atomic (tmp file + rename).
- `src/.weather-cli/data.json` is tracked in git but is a **vestigial artifact** from an older relative-path storage scheme — don't rely on it; it's safe to git-rm.
- Menú opciones 1–6, 8, 9; opción 1 muestra clima actual + pronóstico 7 días; opción 6 muestra pronóstico de una ciudad elegida de la lista.
- APIs: geocoding (`count=1&language=es`, primer resultado — nombres ambiguos pueden resolver otra ciudad) y forecast con `current=temperature_2m` y `daily=temperature_2m_max,temperature_2m_min` (`timezone=auto&forecast_days=7`; `getDailyForecast` devuelve `null` al fallar).
- `ideas-revision.md` is the active backlog / review checklist (e.g. pending: tests with mocks, loading indicators; 7-day forecast already done).
- Input is queued via readline; if **stdin closes** (EOF), `inputExhausted()` in `index.ts` exits the app — without it the main loop spins forever on empty `getInput` results.
