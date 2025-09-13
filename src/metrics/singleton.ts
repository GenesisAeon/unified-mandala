// HMR/ESM- und Test-sichere Prometheus-Metriken (prom-client)
import * as client from "prom-client";

type Cfg<T extends string = string> =
  | client.CounterConfiguration<T>
  | client.GaugeConfiguration<T>
  | client.HistogramConfiguration<T>
  | client.SummaryConfiguration<T>;

type Store = {
  REG: client.Registry;
  defaultsDone: boolean;
  C: Record<string, client.Counter<string>>;
  G: Record<string, client.Gauge<string>>;
  H: Record<string, client.Histogram<string>>;
  S: Record<string, client.Summary<string>>;
};

const G: any = globalThis as any;
if (!G.__UM_METRICS__) {
  const REG = new client.Registry();
  REG.setDefaultLabels({ service: "unified-mandala" });
  G.__UM_METRICS__ = {
    REG,
    defaultsDone: false,
    C: {},
    G: {},
    H: {},
    S: {},
  } as Store;
}
const store = G.__UM_METRICS__ as Store;
export const REG = store.REG;

export function ensureDefaultMetrics() {
  if (!store.defaultsDone) {
    client.collectDefaultMetrics({ register: REG });
    store.defaultsDone = true;
  }
}

// --- Helpers -------------------------------------------------------------

export function getOrCreateCounter<T extends string = string>(
  cfg: client.CounterConfiguration<T>
) {
  const name = cfg.name;
  if (store.C[name]) return store.C[name] as client.Counter<T>;
  // Explizit in unsere REG registrieren (kein Default-Register!)
  const c = new client.Counter<T>({ ...cfg, registers: [REG] });
  store.C[name] = c as unknown as client.Counter<string>;
  return c;
}

export function getOrCreateGauge<T extends string = string>(
  cfg: client.GaugeConfiguration<T>
) {
  const name = cfg.name;
  if (store.G[name]) return store.G[name] as client.Gauge<T>;
  const g = new client.Gauge<T>({ ...cfg, registers: [REG] });
  store.G[name] = g as unknown as client.Gauge<string>;
  return g;
}

export function getOrCreateHistogram<T extends string = string>(
  cfg: client.HistogramConfiguration<T>
) {
  const name = cfg.name;
  if (store.H[name]) return store.H[name] as client.Histogram<T>;
  const h = new client.Histogram<T>({ ...cfg, registers: [REG] });
  store.H[name] = h as unknown as client.Histogram<string>;
  return h;
}

export function getOrCreateSummary<T extends string = string>(
  cfg: client.SummaryConfiguration<T>
) {
  const name = cfg.name;
  if (store.S[name]) return store.S[name] as client.Summary<T>;
  const s = new client.Summary<T>({ ...cfg, registers: [REG] });
  store.S[name] = s as unknown as client.Summary<string>;
  return s;
}

// Für /metrics-Endpoints:
export async function metricsText(): Promise<string> {
  return REG.metrics();
}
