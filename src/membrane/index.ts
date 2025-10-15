export const isLowMem = process.env.LOW_MEM === '1' || process.env.VITE_LOW_MEM === 'on';

export type HorizonState = 'subcritical' | 'apparent' | 'event';
export type MembraneReading = {
  t: number;
  value: number;
  severity: 'ok' | 'warn' | 'alarm';
  state: HorizonState;
  dA: number;
  A: number;
};

class NoOpMembrane {
  step(t: number, v: number): MembraneReading {
    return { t, value: v, severity: 'ok', state: 'subcritical', dA: 0, A: 0 };
  }
}

export const NullMembrane = isLowMem
  ? NoOpMembrane
  : (await import('./real-membrane.js')).RealMembrane;

const asciiSigil = (state: HorizonState) =>
  state === 'event' ? '[!]' : state === 'apparent' ? '~~' : '--';

const emojiSigil = (state: HorizonState) =>
  state === 'event' ? '🛡️' : state === 'apparent' ? '🟠' : '🟢';

export const membraneSigil = (state: HorizonState) => {
  // Prefer ASCII in CI to align with test expectations
  if (process.env.CI === '1' || process.env.UM_ASCII_SIGILS === '1') {
    return asciiSigil(state);
  }
  return emojiSigil(state);
};

export type { RealMembraneConfig } from './real-membrane.js';
