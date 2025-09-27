// Centralised port mapping with optional PORT_OFFSET and env overrides

export const defaults = {
  SHARE: 3001,
  EXPERIMENTS: 3002,
  RAG: 3003,
  FLAGS: 3004,
  AI_API: 4000,
  REALTIME: 4020, // HTTP/control
  REALTIME_WS: 4021, // WebSocket
  HEALTH: 3999,
};

function parseNum(value: string | undefined): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number.parseInt(String(value), 10);
  if (Number.isNaN(n) || !Number.isFinite(n)) return undefined;
  return n;
}

const off = parseNum(process.env.PORT_OFFSET) ?? 0;

function pick(names: string[], fallback: number): number {
  for (const name of names) {
    const n = parseNum((process.env as any)[name]);
    if (n !== undefined) return n + off;
  }
  return fallback + off;
}

export const ports = {
  share: pick(['SHARE_API_PORT', 'SHARE_PORT', 'PORT_SHARE'], defaults.SHARE),
  experiments: pick(
    ['EXPERIMENTS_API_PORT', 'EXPERIMENTS_PORT', 'PORT_EXPERIMENTS'],
    defaults.EXPERIMENTS,
  ),
  rag: pick(['RAG_API_PORT', 'RAG_PORT', 'PORT_RAG'], defaults.RAG),
  flags: pick(['FLAGS_API_PORT', 'FLAGS_PORT', 'PORT_FLAGS'], defaults.FLAGS),
  ai: pick(['AI_API_PORT', 'PORT'], defaults.AI_API),
  realtime: pick(['REALTIME_HUB_PORT', 'REALTIME_PORT', 'PORT_REALTIME'], defaults.REALTIME),
  realtimeWS: pick(['REALTIME_WS_PORT', 'PORT_REALTIME_WS'], defaults.REALTIME_WS),
  health: pick(['UM_HEALTH_PORT', 'HEALTH_PORT', 'PORT_HEALTH'], defaults.HEALTH),
};

export default ports;

