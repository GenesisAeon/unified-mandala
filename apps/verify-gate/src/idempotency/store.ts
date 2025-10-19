import Database from 'better-sqlite3';

type VerdictColor = 'green' | 'yellow' | 'red';

type StoredRow = {
  status: number;
  ts: number;
  exp: number;
  request_id: string | null;
  verdict: string | null;
  evidence_count: number | null;
  pending: number;
};

type StoreEntry = {
  status: number;
  ts: number;
  requestId: string;
  verdict?: VerdictColor;
  evidenceCount?: number;
  pending: boolean;
};

function resolveDbPath(): string {
  const candidate = process.env.VERIFY_GATE_IDEMP_DB;
  if (candidate && candidate.trim().length > 0) {
    return candidate.trim();
  }
  return 'idem.db';
}

function resolveTtl(): number {
  const raw = Number(process.env.VERIFY_GATE_IDEMP_TTL_MS ?? '120000');
  return Number.isFinite(raw) && raw > 0 ? raw : 120000;
}

const db = new Database(resolveDbPath());
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS idem (
    k TEXT PRIMARY KEY,
    status INTEGER NOT NULL,
    ts INTEGER NOT NULL,
    exp INTEGER NOT NULL,
    request_id TEXT,
    verdict TEXT,
    evidence_count INTEGER,
    pending INTEGER NOT NULL
  )
`);

db.exec('CREATE INDEX IF NOT EXISTS idx_idem_exp ON idem (exp)');

const selectStmt = db.prepare<StoredRow & { k: string }>('SELECT status, ts, exp, request_id, verdict, evidence_count, pending FROM idem WHERE k = ?');
const insertStmt = db.prepare(
  `INSERT INTO idem (k, status, ts, exp, request_id, verdict, evidence_count, pending)
   VALUES (@key, @status, @ts, @exp, @requestId, @verdict, @evidenceCount, @pending)
   ON CONFLICT(k) DO UPDATE SET
     status = excluded.status,
     ts = excluded.ts,
     exp = excluded.exp,
     request_id = excluded.request_id,
     verdict = excluded.verdict,
     evidence_count = excluded.evidence_count,
     pending = excluded.pending`
);
const deleteStmt = db.prepare('DELETE FROM idem WHERE k = ?');
const purgeStmt = db.prepare('DELETE FROM idem WHERE exp <= ?');
const countStmt = db.prepare<{ count: number }>('SELECT COUNT(*) as count FROM idem');

function normalizeVerdict(value: string | null): VerdictColor | undefined {
  if (!value) return undefined;
  if (value === 'green' || value === 'yellow' || value === 'red') {
    return value;
  }
  return undefined;
}

function toStoreEntry(key: string, row: StoredRow | undefined): StoreEntry | null {
  if (!row) {
    return null;
  }
  const now = Date.now();
  if (row.exp <= now) {
    deleteStmt.run(key);
    return null;
  }
  return {
    status: row.status,
    ts: row.ts,
    requestId: row.request_id ?? '',
    verdict: normalizeVerdict(row.verdict),
    evidenceCount: typeof row.evidence_count === 'number' ? row.evidence_count : undefined,
    pending: row.pending === 1,
  };
}

function purgeExpired(): void {
  try {
    purgeStmt.run(Date.now());
  } catch (error) {
    console.error('[verify-gate] failed to purge idempotency rows', error);
  }
}

export function get(key: string): StoreEntry | null {
  try {
    purgeExpired();
    const row = selectStmt.get(key) as StoredRow | undefined;
    return toStoreEntry(key, row) ?? null;
  } catch (error) {
    console.error('[verify-gate] failed to load idempotency entry', error);
    return null;
  }
}

export function setPending(key: string, requestId: string): void {
  try {
    const now = Date.now();
    insertStmt.run({
      key,
      status: -1,
      ts: now,
      exp: now + resolveTtl(),
      requestId,
      verdict: null,
      evidenceCount: null,
      pending: 1,
    });
  } catch (error) {
    console.error('[verify-gate] failed to persist pending idempotency entry', error);
  }
}

export function setFinal(
  key: string,
  status: number,
  requestId: string,
  verdict: VerdictColor,
  evidenceCount: number,
): void {
  try {
    const now = Date.now();
    insertStmt.run({
      key,
      status,
      ts: now,
      exp: now + resolveTtl(),
      requestId,
      verdict,
      evidenceCount,
      pending: 0,
    });
  } catch (error) {
    console.error('[verify-gate] failed to persist final idempotency entry', error);
  }
}

export function remove(key: string): void {
  try {
    deleteStmt.run(key);
  } catch (error) {
    console.error('[verify-gate] failed to remove idempotency entry', error);
  }
}

export function count(): number {
  try {
    purgeExpired();
    const row = countStmt.get();
    return typeof row?.count === 'number' ? row.count : 0;
  } catch (error) {
    console.error('[verify-gate] failed to count idempotency entries', error);
    return 0;
  }
}

const gcInterval = Math.max(30000, resolveTtl());
setInterval(purgeExpired, gcInterval).unref();

export type { StoreEntry };
