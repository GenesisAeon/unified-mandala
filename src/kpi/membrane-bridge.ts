import { FEATURES } from '../config/featureFlags';
import { membraneSigil, NullMembrane, isLowMem } from '../membrane';

export function stepOrBypass(_metric: 't2m' | 'wildfire' | 'groundwater', t: number, v: number) {
  if (isLowMem || FEATURES.membrane !== 'on') {
    return {
      A: undefined as number | undefined,
      sigil: membraneSigil('subcritical'),
      severity: 'ok' as const,
    };
  }
  const mem = new (NullMembrane as any)();
  const out = mem.step(t, v);
  return { A: out.A, sigil: membraneSigil(out.state), severity: out.severity };
}
