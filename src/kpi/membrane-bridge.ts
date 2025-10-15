import { FEATURES } from '../config/featureFlags';
import { membraneSigil, NullMembrane, isLowMem } from '../membrane';

type SupportedMetric = 't2m' | 'wildfire' | 'groundwater';

type HorizonState = import('../membrane').HorizonState;

type MembraneInstance = {
  step(t: number, v: number): { A: number; state: HorizonState; severity: 'ok' | 'warn' | 'alarm' };
};

type MembraneCtor = new () => MembraneInstance;

const membranes = new Map<SupportedMetric, MembraneInstance>();

function ensureMembrane(metric: SupportedMetric) {
  if (!membranes.has(metric)) {
    const Mem = NullMembrane as unknown as MembraneCtor;
    membranes.set(metric, new Mem());
  }
  return membranes.get(metric)!;
}

export function stepOrBypass(metric: SupportedMetric, t: number, v: number) {
  if (isLowMem || FEATURES.membrane !== 'on') {
    return {
      A: undefined as number | undefined,
      sigil: membraneSigil('subcritical'),
      severity: 'ok' as const,
    };
  }
  const membrane = ensureMembrane(metric);
  const out = membrane.step(t, v);
  return { A: out.A, sigil: membraneSigil(out.state), severity: out.severity };
}
