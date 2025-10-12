import * as client from 'prom-client';

const G: any = globalThis as any;
if (!G.__UM_METRICS__) {
  const REG = new client.Registry();
  REG.setDefaultLabels({ service: 'unified-mandala' });
  G.__UM_METRICS__ = { REG, defaultsDone: false, C: {}, G: {}, H: {}, S: {} };
}
const store = G.__UM_METRICS__;
export const REG: client.Registry = store.REG;

export function ensureDefaultMetrics() {
  if (!store.defaultsDone) {
    client.collectDefaultMetrics({ register: REG });
    store.defaultsDone = true;
  }
}

type Cfg = { name: string; help?: string; labelNames?: string[] };

export const getOrCreateCounter = (c: Cfg) =>
  (store.C[c.name] ||= new client.Counter({
    registers: [REG],
    name: c.name,
    help: c.help ?? c.name,
    labelNames: c.labelNames ?? [],
  }));

export const getOrCreateGauge = (c: Cfg) =>
  (store.G[c.name] ||= new client.Gauge({
    registers: [REG],
    name: c.name,
    help: c.help ?? c.name,
    labelNames: c.labelNames ?? [],
  }));

export const getOrCreateHistogram = (c: Cfg & { buckets?: number[] }) =>
  (store.H[c.name] ||= new client.Histogram({
    registers: [REG],
    name: c.name,
    help: c.help ?? c.name,
    labelNames: c.labelNames ?? [],
    buckets: c.buckets ?? [0.1, 0.5, 1, 2, 5],
  }));

export const getOrCreateSummary = (c: Cfg & { percentiles?: number[] }) =>
  (store.S[c.name] ||= new client.Summary({
    registers: [REG],
    name: c.name,
    help: c.help ?? c.name,
    labelNames: c.labelNames ?? [],
    percentiles: c.percentiles ?? [0.5, 0.9, 0.99],
  }));

export async function metricsText(): Promise<string> {
  return REG.metrics();
}
