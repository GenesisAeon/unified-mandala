import crypto from 'node:crypto';
import { count, get, remove, setFinal, setPending, type StoreEntry } from './store.js';

type VerdictColor = 'green' | 'yellow' | 'red';

type Entry = {
  status: number;
  ts: number;
  requestId: string;
  verdict?: VerdictColor;
  evidenceCount?: number;
  pending: boolean;
};

function mapStoreEntry(row: StoreEntry | null): Entry | null {
  if (!row) {
    return null;
  }
  return {
    status: row.status,
    ts: row.ts,
    requestId: row.requestId,
    verdict: row.verdict,
    evidenceCount: row.evidenceCount,
    pending: row.pending,
  };
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
  return mapStoreEntry(get(key));
}

export function rememberPending(key: string, requestId: string): void {
  setPending(key, requestId);
}

export function rememberFinal(
  key: string,
  status: number,
  requestId: string,
  verdict: VerdictColor,
  evidenceCount: number,
): void {
  setFinal(key, status, requestId, verdict, evidenceCount);
}

export function forget(key: string): void {
  remove(key);
}

export function getEntryCount(): number {
  return count();
}

export type { Entry };
