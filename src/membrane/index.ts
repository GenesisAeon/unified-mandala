import { MEMBRANE_CFG } from './config.js';

export const isLowMem =
  MEMBRANE_CFG.MODE === 'null' || process.env.LOW_MEM === '1' || process.env.VITE_LOW_MEM === 'on';

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

const preferAscii = () =>
  MEMBRANE_CFG.CI_ASCII || process.env.UM_ASCII_SIGILS === '1' || process.env.CI === '1';

export const membraneSigil = (state: HorizonState, forceAscii?: boolean) => {
  const useAscii = typeof forceAscii === 'boolean' ? forceAscii : preferAscii();
  return useAscii ? asciiSigil(state) : emojiSigil(state);
};

export { MEMBRANE_CFG };
export type { RealMembraneConfig } from './real-membrane.js';
