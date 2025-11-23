import { RealMembrane as RealMembraneImpl, type RealMembraneConfig } from './real-membrane';

export const RealMembrane = RealMembraneImpl;

export const isLowMem = () =>
  process.env.LOW_MEM === '1' ||
  process.env.LOW_MEM === 'true' ||
  process.env.VITE_LOW_MEM === 'on';

export type HorizonState = 'subcritical' | 'apparent' | 'event';
export type MembraneReading = {
  t: number;
  value: number;
  severity: 'ok' | 'warn' | 'alarm';
  state: HorizonState;
  dA: number;
  A: number;
};

export class NoOpMembrane {
  constructor(_config?: RealMembraneConfig) {}

  step(t: number, v: number): MembraneReading {
    return { t, value: v, severity: 'ok', state: 'subcritical', dA: 0, A: 0 };
  }
}

export const NullMembrane = NoOpMembrane;

export const createMembrane = (config?: RealMembraneConfig) =>
  isLowMem() ? new NoOpMembrane(config) : new RealMembraneImpl(config);

const asciiSigil = (state: HorizonState) =>
  state === 'event' ? '[!!]' : state === 'apparent' ? '[~]' : '[ok]';

const emojiSigil = (state: HorizonState) =>
  state === 'event' ? '🔴' : state === 'apparent' ? '🟠' : '🟢';

export const membraneSigil = (state: HorizonState) => {
  if (process.env.CI === '1' || process.env.UM_ASCII_SIGILS === '1') {
    return asciiSigil(state);
  }
  return emojiSigil(state);
};

export type { RealMembraneConfig };
