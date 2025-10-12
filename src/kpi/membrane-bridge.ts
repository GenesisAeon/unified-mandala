import { FEATURES } from '../config/featureFlags';

type Severity = 'ok' | 'warn' | 'alarm';

function membraneFromThresholds(_metric: 't2m' | 'wildfire' | 'groundwater') {
  return {
    step: (_t: number, v: number) => ({
      A: v,
      state: 'ok' as Severity,
      severity: 'ok' as Severity,
    }),
  };
}

function toSigil(state: Severity) {
  switch (state) {
    case 'warn':
      return '🟠';
    case 'alarm':
      return '🔴';
    default:
      return '🟢';
  }
}

export function stepOrBypass(metric: 't2m' | 'wildfire' | 'groundwater', t: number, v: number) {
  const lowMem =
    (typeof process !== 'undefined' &&
      (process.env.LOW_MEM === '1' || process.env.LOW_MEM === 'true')) ||
    false;
  if (lowMem || FEATURES.membrane !== 'on') {
    // LowMem: kein State, nur triviales Sigil zurückgeben
    return { A: undefined as number | undefined, sigil: '🟢', severity: 'ok' as const };
  }
  const m = membraneFromThresholds(metric);
  const r = m.step(t, v);
  return { A: r.A, sigil: '??', severity: r.severity };
}
