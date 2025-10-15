import type { HorizonState } from './index.js';
import { getOrCreateCounter, getOrCreateHistogram } from '../metrics/singleton.js';

export const stepTotal = getOrCreateCounter({
  name: 'membrane_steps_total',
  help: 'Total number of membrane.step invocations',
});

export const stateChanges = getOrCreateCounter({
  name: 'membrane_state_changes_total',
  help: 'State transitions reported by membrane.step',
  labelNames: ['from', 'to'],
});

export const stepLatency = getOrCreateHistogram({
  name: 'membrane_step_latency_ms',
  help: 'Latency distribution for membrane.step (ms)',
  buckets: [1, 2, 5, 10, 20, 50, 100],
});

export function recordStep(from: HorizonState, to: HorizonState, durationMs: number) {
  stepTotal.inc();
  if (from !== to) {
    stateChanges.inc({ from, to });
  }
  stepLatency.observe(durationMs);
}
