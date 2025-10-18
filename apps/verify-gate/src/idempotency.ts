import crypto from 'node:crypto';

type Entry = {
  status: number;
  ts: number;
  requestId: string;
  verdict?: 'green' | 'yellow' | 'red';
  evidenceCount?: number;
  pending: boolean;
};

const TTL_MS = Number(process.env.VERIFY_GATE_IDEMP_TTL_MS ?? '60000');
const store = new Map<string, Entry>();

function cleanupExpired(): void {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now - entry.ts > TTL_MS) {
      store.delete(key);
    }
  }
}

export function makeKey(
  method: string,
  url: string,
  body?: unknown,
  headerSignature?: string,
): string {
  const hash = crypto.createHash('sha1');
  hash.update(method.toUpperCase()).update('|').update(url).update('|');
  if (headerSignature) {
    hash.update(headerSignature).update('|');
  }
  if (body !== undefined) {
    hash.update(JSON.stringify(body));
  }
  return hash.digest('hex');
}

export function seen(key: string): Entry | null {
  cleanupExpired();
  const entry = store.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() - entry.ts > TTL_MS) {
    store.delete(key);
    return null;
  }
  return entry;
}

export function rememberPending(key: string, requestId: string): void {
  cleanupExpired();
  store.set(key, { status: -1, ts: Date.now(), requestId, pending: true });
}

export function rememberFinal(
  key: string,
  status: number,
  requestId: string,
  verdict: 'green' | 'yellow' | 'red',
  evidenceCount: number,
): void {
  cleanupExpired();
  store.set(key, {
    status,
    ts: Date.now(),
    requestId,
    verdict,
    evidenceCount,
    pending: false,
  });
}

export function forget(key: string): void {
  store.delete(key);
}

export function getEntryCount(): number {
  cleanupExpired();
  return store.size;
}

setInterval(cleanupExpired, TTL_MS).unref();
