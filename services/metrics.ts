import { Counter, collectDefaultMetrics, Registry } from 'prom-client';

export const register = new Registry();
collectDefaultMetrics({ register });

export const patternCreateCounter = new Counter({
  name: 'patterns_created_total',
  help: 'Number of patterns created',
  registers: [register]
});

export const haikuVoteCounter = new Counter({
  name: 'haiku_votes_total',
  help: 'Number of haiku votes',
  registers: [register]
});

const abVariantCounter = new Counter({
  name: 'layout_variant_total',
  help: 'Count of AB layout variants',
  labelNames: ['variant'],
  registers: [register]
});

export function recordABVariant(variant: 'A' | 'B') {
  abVariantCounter.labels(variant).inc();
}
