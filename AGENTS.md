# AGENTS.md - 02-Weather

## Project Overview
Weather CLI app built with **Bun.js** + **TypeScript** targeting a single executable binary. Uses **OpenMeteo** API (geocoding + forecast).

## Commands
```bash
# Install deps
bun install

# Run dev
bun run index.ts

# Typecheck
bunx tsc --noEmit

# Build binary (when ready)
bun build --compile index.ts --outfile weather
```

## Stack & Config
- **Runtime**: Bun (ESM, `type: "module"`)
- **Entry**: `index.ts`
- **TSConfig**: Strict mode, bundler resolution, ESNext target, no emit
- **No test/lint tools configured yet**

## API Flow
1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=es&format=json`
2. Forecast: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m`

## Menu Design (Target)
```
1. Clima de ciudad default
2. Clima de todas las ciudades
3. Buscar y agregar ciudad
4. Eliminar ciudad
5. Establecer ciudad default
8. Ajustes (°C/°F)
9. Salir
```

## Project State
Minimal scaffold - only `console.log("Hello via Bun!")` in `index.ts`. Core features not yet implemented.

## Key Files
- `index.ts` - Main entry point
- `package.json` - Bun config, private module
- `tsconfig.json` - Strict TS config for Bun
- `.gitignore` - Standard Bun/Node ignores