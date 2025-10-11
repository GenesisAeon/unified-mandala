import { getOrCreateGauge, getOrCreateCounter } from './singleton';

export const realityScoreGauge = getOrCreateGauge({
  name: 'reality_score',
  help: 'Latest reality score',
  labelNames: ['source'],
});
export const realityDecisionTotal = getOrCreateCounter({
  name: 'reality_decision_total',
  help: 'Reality decisions',
  labelNames: ['decision', 'source'],
});

export function recordReality(
  source: string,
  score: number,
  decision: 'external' | 'ambiguous' | 'imaginative',
) {
  realityScoreGauge.labels(source).set(score);
  realityDecisionTotal.labels(decision, source).inc();
}
