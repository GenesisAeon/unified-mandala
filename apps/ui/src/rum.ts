// Runtime-controllable RUM bootstrap for Vite UI
// - Toggle via localStorage (mandala_rum on/off) or env VITE_ENABLE_RUM=on
// - Collector URL via localStorage (mandala_rum_url) or env VITE_OTEL_COLLECTOR_URL
/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    __rum?: {
      enabled: boolean;
      enable: (collectorUrl?: string) => Promise<void>;
      disable: () => Promise<void>;
      status: () => { enabled: boolean; url?: string };
      setCollectorUrl: (url: string) => void;
      _impl?: any;
      _url?: string;
    };
  }
}

const LS_KEY_FLAG = 'mandala_rum';
const LS_KEY_URL = 'mandala_rum_url';

function lsGet(key: string): string | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}
function lsSet(key: string, val: string): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, val);
  } catch {}
}

const envEnabled = String((import.meta as any).env?.VITE_ENABLE_RUM || '').toLowerCase() === 'on';
const lsEnabled = (lsGet(LS_KEY_FLAG) || '').toLowerCase() === 'on';
const shouldEnable = lsEnabled || envEnabled;
const defaultUrl =
  lsGet(LS_KEY_URL) || (import.meta as any).env?.VITE_OTEL_COLLECTOR_URL || 'http://localhost:4318/v1/traces';

let active = false;

async function doEnable(collectorUrl?: string): Promise<void> {
  if (active) return;
  const url = collectorUrl || window.__rum?._url || defaultUrl;
  // dynamic import to keep bundle lean
  const web = await import('@opentelemetry/sdk-trace-web');
  const base = await import('@opentelemetry/sdk-trace-base');
  const http = await import('@opentelemetry/exporter-trace-otlp-http');
  const instDoc = await import('@opentelemetry/instrumentation-document-load');
  const inst = await import('@opentelemetry/instrumentation');

  const provider = new web.WebTracerProvider();
  const exporter = new http.OTLPTraceExporter({ url });
  const proc = new base.BatchSpanProcessor(exporter);
  provider.addSpanProcessor(proc);
  provider.register();

  inst.registerInstrumentations({ instrumentations: [new instDoc.DocumentLoadInstrumentation()] });

  window.__rum!._impl = { provider, exporter, proc };
  window.__rum!._url = url;
  active = true;
  window.__rum!.enabled = true;
  lsSet(LS_KEY_FLAG, 'on');
  if (collectorUrl) lsSet(LS_KEY_URL, collectorUrl);
  // eslint-disable-next-line no-console
  console.log('[RUM] enabled ->', url);
}

async function doDisable(): Promise<void> {
  if (!active) return;
  try {
    const impl = window.__rum?._impl;
    await impl?.provider?.shutdown?.();
  } catch {}
  active = false;
  if (window.__rum) {
    window.__rum.enabled = false;
    window.__rum._impl = undefined;
  }
  lsSet(LS_KEY_FLAG, 'off');
  // eslint-disable-next-line no-console
  console.log('[RUM] disabled');
}

if (!window.__rum) {
  window.__rum = {
    enabled: false,
    _url: defaultUrl,
    enable: doEnable,
    disable: doDisable,
    status: () => ({ enabled: !!active, url: window.__rum?._url }),
    setCollectorUrl: (url: string) => {
      if (!url) return;
      if (window.__rum) window.__rum._url = url;
      lsSet(LS_KEY_URL, url);
    },
  };
}

if (shouldEnable) {
  // fire-and-forget
  void doEnable(defaultUrl);
}

