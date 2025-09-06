// Schlanke, funktionale Schnittstelle (funktion = Adapter)
export interface AdapterInput {
  params?: Record<string, unknown>;
  signal?: AbortSignal;
}

export interface AdapterResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
  cached?: boolean; // true, wenn aus Cache
}

export type Adapter<T> = (input?: AdapterInput) => Promise<AdapterResult<T>>;

// Hilfen
export function ok<T>(data: T, meta: Record<string, unknown> = {}): AdapterResult<T> {
  return { ok: true, data, meta };
}
export function fail<T = never>(error: string, meta: Record<string, unknown> = {}): AdapterResult<T> {
  return { ok: false, error, meta };
}

// Utility: Keybildung für Cache (parametrisiert)
export function keyOf(input?: AdapterInput): string {
  const p = input?.params ?? {};
  return JSON.stringify(p, Object.keys(p).sort());
}
