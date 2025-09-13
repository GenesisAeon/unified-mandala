import { collectDefaultMetrics } from 'prom-client';
import { REG, getOrCreateCounter } from '../src/metrics/singleton';

collectDefaultMetrics({ register: REG });

export const patternCreateCounter = getOrCreateCounter({
  name: 'patterns_created_total',
  help: 'Number of patterns created',
});

export const haikuVoteCounter = getOrCreateCounter({
  name: 'haiku_votes_total',
  help: 'Number of haiku votes',
});

const abVariantCounter = getOrCreateCounter({
  name: 'layout_variant_total',
  help: 'Count of AB layout variants',
  labelNames: ['variant'] as const,
});

export function recordABVariant(variant: 'A' | 'B') {
  abVariantCounter.labels(variant).inc();
}
