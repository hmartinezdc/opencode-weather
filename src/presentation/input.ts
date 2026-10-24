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

/** True when stdin closed and the queued input is exhausted (no further input will ever arrive). */
export function inputExhausted(): boolean {
  return inputEnded && inputBuffer.length === 0;
}
