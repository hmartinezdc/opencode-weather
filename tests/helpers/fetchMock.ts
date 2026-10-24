import { mock } from 'bun:test';

/** Tipo de entrada que acepta `fetch` (sirve para tipar las llamadas registradas). */
type EntradaFetch = Parameters<typeof fetch>[0];

/**
 * Reemplaza `fetch` global por un mock que responde `datos` como JSON con status 200.
 * Devuelve el mock para inspeccionar las llamadas (URL, etc.).
 */
export function fetchCon(datos: unknown) {
  const fetchMock = mock(async (_input: EntradaFetch, _init?: RequestInit): Promise<Response> =>
    new Response(JSON.stringify(datos), { status: 200, headers: { 'content-type': 'application/json' } }),
  );
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

/**
 * Reemplaza `fetch` global por un mock que responde con un cuerpo de texto crudo
 * (útil para simular JSON malformado con status 200).
 */
export function fetchConCuerpo(cuerpo: string, status = 200) {
  const fetchMock = mock(async (_input: EntradaFetch, _init?: RequestInit): Promise<Response> =>
    new Response(cuerpo, { status }),
  );
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

/** Igual que `fetchConCuerpo` pero da igual el cuerpo: solo importa el status HTTP fallido. */
export function fetchConEstado(status: number) {
  return fetchConCuerpo('error', status);
}

/** Reemplaza `fetch` global por un mock que lanza (fallo de red simulado). */
export function fetchQueFalla() {
  const fetchMock = mock(async (_input: EntradaFetch, _init?: RequestInit): Promise<Response> => {
    throw new Error('fallo de red simulado');
  });
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}
