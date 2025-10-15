import { FEATURES } from '../config/featureFlags';
import { membraneSigil, isLowMem, MEMBRANE_CFG } from '../membrane';
import type { HorizonState } from '../membrane';
import { RealMembrane } from '../membrane/real-membrane.js';
import { getMembrane } from '../membrane/registry.js';
import { publishBoundary } from '../boundary/publisher.js';

const PREFIX = 'kpi:membrane:';

type SupportedMetric = 't2m' | 'wildfire' | 'groundwater';

type MembraneInstance = RealMembrane;

type MembraneReading = ReturnType<MembraneInstance['step']>;

const lastStates = new Map<SupportedMetric, HorizonState>();

const shouldBypass = () => isLowMem || FEATURES.membrane !== 'on' || MEMBRANE_CFG.MODE === 'null';

function ensureMembrane(metric: SupportedMetric) {
  return getMembrane(`${PREFIX}${metric}`, () => new RealMembrane());
}

export function stepOrBypass(metric: SupportedMetric, t: number, v: number) {
  if (shouldBypass()) {
    return {
      A: undefined as number | undefined,
      dA: undefined as number | undefined,
      state: 'subcritical' as HorizonState,
      sigil: membraneSigil('subcritical'),
      severity: 'ok' as const,
      enabled: false,
    };
  }
  const membrane = ensureMembrane(metric);
  const prev = lastStates.get(metric) ?? 'subcritical';
  const out = membrane.step(t, v) as MembraneReading;
  lastStates.set(metric, out.state);
  if (prev !== out.state) {
    const enteringEvent = prev !== 'event' && out.state === 'event';
    const recovered = prev === 'event' && out.state !== 'event';
    if (enteringEvent || recovered) {
      void publishBoundary({
        ts: new Date(t).toISOString(),
        source: 'membrane',
        ruleId: enteringEvent ? 'membrane:event' : 'membrane:recovery',
        verdict: enteringEvent ? 'violation' : 'resolve',
        severity: enteringEvent ? 'alarm' : 'ok',
        details: { metric, A: out.A, dA: out.dA, state: out.state },
      });
    }
  }
  return {
    A: out.A,
    dA: out.dA,
    state: out.state,
    sigil: membraneSigil(out.state),
    severity: out.severity,
    enabled: true,
  };
}
