import { vi } from 'vitest';

type StoredRow = {
  status: number;
  ts: number;
  exp: number;
  request_id: string | null;
  verdict: string | null;
  evidence_count: number | null;
  pending: number;
};

const GLOBAL_STORE_KEY = Symbol.for('verify-gate-idem-stores');

function getStore(filename: string): Map<string, StoredRow> {
  const globalStores = (globalThis as unknown as Record<symbol, Map<string, Map<string, StoredRow>>>)[GLOBAL_STORE_KEY] ??=
    new Map<string, Map<string, StoredRow>>();
  let store = globalStores.get(filename);
  if (!store) {
    store = new Map<string, StoredRow>();
    globalStores.set(filename, store);
  }
  return store;
}

class Statement<T = unknown> {
  constructor(private readonly filename: string, private readonly kind: 'select' | 'insert' | 'deleteKey' | 'deleteExpired' | 'count') {}

  run(payload?: unknown): { changes: number; lastInsertRowid: number } {
    const store = getStore(this.filename);
    if (this.kind === 'insert' && payload && typeof payload === 'object') {
      const entry = payload as Record<string, unknown>;
      store.set(String(entry.key), {
        status: Number(entry.status ?? 0),
        ts: Number(entry.ts ?? Date.now()),
        exp: Number(entry.exp ?? Date.now()),
        request_id: entry.requestId === undefined ? null : String(entry.requestId),
        verdict: entry.verdict === undefined ? null : (entry.verdict as string | null),
        evidence_count: entry.evidenceCount === undefined ? null : Number(entry.evidenceCount),
        pending: Number(entry.pending ?? 0),
      });
      return { changes: 1, lastInsertRowid: 0 };
    }
    if (this.kind === 'deleteKey') {
      const key = String(payload ?? '');
      const existed = store.delete(key);
      return { changes: existed ? 1 : 0, lastInsertRowid: 0 };
    }
    if (this.kind === 'deleteExpired') {
      const cutoff = typeof payload === 'number' ? payload : Number(payload ?? Date.now());
      let changes = 0;
      for (const [key, row] of store.entries()) {
        if (row.exp <= cutoff) {
          store.delete(key);
          changes += 1;
        }
      }
      return { changes, lastInsertRowid: 0 };
    }
    return { changes: 0, lastInsertRowid: 0 };
  }

  get(arg?: unknown): (T & { k: string }) | { count: number } | undefined {
    const store = getStore(this.filename);
    if (this.kind === 'select') {
      const key = String(arg ?? '');
      const row = store.get(key);
      return row ? ({ ...row, k: key } as unknown as T & { k: string }) : undefined;
    }
    if (this.kind === 'count') {
      let count = 0;
      const now = Date.now();
      for (const row of store.values()) {
        if (row.exp > now) count += 1;
      }
      return { count };
    }
    return undefined;
  }

  all(): T[] {
    return [];
  }
}

class MockDatabase {
  constructor(private readonly filename: string) {
    getStore(filename);
  }

  pragma(): void {}

  exec(): this {
    return this;
  }

  prepare<T = unknown>(sql: string): Statement<T> {
    if (sql.startsWith('INSERT INTO idem')) {
      return new Statement<T>(this.filename, 'insert');
    }
    if (sql.startsWith('DELETE FROM idem WHERE k')) {
      return new Statement<T>(this.filename, 'deleteKey');
    }
    if (sql.startsWith('DELETE FROM idem WHERE exp')) {
      return new Statement<T>(this.filename, 'deleteExpired');
    }
    if (sql.startsWith('SELECT COUNT')) {
      return new Statement<T>(this.filename, 'count');
    }
    return new Statement<T>(this.filename, 'select');
  }

  close(): void {}
}

export function mockBetterSqlite(): void {
  vi.mock('better-sqlite3', () => ({
    __esModule: true,
    default: MockDatabase,
  }));
}
