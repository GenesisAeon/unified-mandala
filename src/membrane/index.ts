export const isLowMem = process.env.LOW_MEM === '1' || process.env.VITE_LOW_MEM === 'on';

export type HorizonState = 'subcritical' | 'apparent' | 'event';
export type Reading = { t: number; value: number; severity: 'ok' | 'warn' | 'alarm'; state: HorizonState; dA: number; A: number };

class NoOpMembrane {
  step(t: number, v: number): Reading {
    return { t, value: v, severity: 'ok', state: 'subcritical', dA: 0, A: 0 };
  }
}

export const Membrane = isLowMem
  ? NoOpMembrane
  : (await import('./real-membrane.js')).NullMembrane;

export const membraneSigil = (state: HorizonState) =>
  state === 'event' ? '🛡️' : state === 'apparent' ? '⚠️' : '🟢';
