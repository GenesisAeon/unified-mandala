// HMR/ESM- und Test-sichere Prometheus-Metriken (prom-client)
const client = require('prom-client');

const G = global;
if (!G.__UM_METRICS__) {
  const REG = new client.Registry();
  REG.setDefaultLabels({ service: 'unified-mandala' });
  G.__UM_METRICS__ = { REG, defaultsDone: false, C: {}, G: {}, H: {}, S: {} };
}
const store = G.__UM_METRICS__;
const REG = store.REG;

function ensureDefaultMetrics() {
  if (!store.defaultsDone) {
    client.collectDefaultMetrics({ register: REG });
    store.defaultsDone = true;
  }
}

function getOrCreateCounter(cfg) {
  const name = cfg.name;
  if (store.C[name]) return store.C[name];
  const c = new client.Counter({ ...cfg, registers: [REG] });
  store.C[name] = c;
  return c;
}

function getOrCreateGauge(cfg) {
  const name = cfg.name;
  if (store.G[name]) return store.G[name];
  const g = new client.Gauge({ ...cfg, registers: [REG] });
  store.G[name] = g;
  return g;
}

function getOrCreateHistogram(cfg) {
  const name = cfg.name;
  if (store.H[name]) return store.H[name];
  const h = new client.Histogram({ ...cfg, registers: [REG] });
  store.H[name] = h;
  return h;
}

function getOrCreateSummary(cfg) {
  const name = cfg.name;
  if (store.S[name]) return store.S[name];
  const s = new client.Summary({ ...cfg, registers: [REG] });
  store.S[name] = s;
  return s;
}

async function metricsText() {
  return REG.metrics();
}

module.exports = {
  REG,
  ensureDefaultMetrics,
  getOrCreateCounter,
  getOrCreateGauge,
  getOrCreateHistogram,
  getOrCreateSummary,
  metricsText,
};
