import { FEATURES } from '../config/featureFlags';
import {
  createMembrane,
  isLowMem,
  membraneSigil,
  type MembraneReading,
  type RealMembraneConfig,
} from '../membrane';

type Metric = 't2m' | 'wildfire' | 'groundwater';

type StepResult = {
  A: number | undefined;
  sigil: string;
  severity: MembraneReading['severity'];
};

const metricConfigs: Record<Metric, RealMembraneConfig> = {
  t2m: { thresholdOk: 1.0, thresholdWarn: 2.0, hysteresis: 0.2, debounce: 3 },
  wildfire: { thresholdOk: 0.8, thresholdWarn: 1.6, hysteresis: 0.25, debounce: 3 },
  groundwater: { thresholdOk: 0.9, thresholdWarn: 1.8, hysteresis: 0.25, debounce: 4 },
};

const membranes = new Map<Metric, ReturnType<typeof createMembrane>>();

export const resetMembraneRegistry = () => membranes.clear();

const membraneFeatureOn = () => `${FEATURES.membrane}` === 'on' && !isLowMem();

const ensureMembrane = (metric: Metric) => {
  const cached = membranes.get(metric);
  if (cached) {
    return cached;
  }
  const instance = createMembrane(metricConfigs[metric]);
  membranes.set(metric, instance);
  return instance;
};

export function stepOrBypass(metric: Metric, t: number, v: number): StepResult {
  if (!membraneFeatureOn()) {
    return { A: undefined, sigil: membraneSigil('subcritical'), severity: 'ok' };
  }

  const membrane = ensureMembrane(metric);
  const reading = membrane.step(t, v);
  return { A: reading.A, sigil: membraneSigil(reading.state), severity: reading.severity };
}
