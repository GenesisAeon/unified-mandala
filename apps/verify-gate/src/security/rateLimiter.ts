import Database from 'better-sqlite3';

type BetterSqliteDatabase = InstanceType<typeof Database>;

export type RateDecision = { allowed: boolean; remaining: number };

export class RateLimiter {
  private readonly selectStmt;
  private readonly upsertStmt;

  constructor(private readonly db: BetterSqliteDatabase, private readonly rpm: number) {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        key TEXT PRIMARY KEY,
        count INTEGER NOT NULL,
        reset INTEGER NOT NULL
      )
    `);
    this.selectStmt = this.db.prepare('SELECT count, reset FROM rate_limits WHERE key = ?');
    this.upsertStmt = this.db.prepare(
      'INSERT OR REPLACE INTO rate_limits (key, count, reset) VALUES (@key, @count, @reset)',
    );
  }

  take(key: string): RateDecision {
    const windowMs = 60_000;
    const now = Date.now();
    const currentWindow = Math.floor(now / windowMs) * windowMs;
    const row = this.selectStmt.get(key) as { count: number; reset: number } | undefined;
    if (!row || row.reset !== currentWindow) {
      this.upsertStmt.run({ key, count: 1, reset: currentWindow });
      return { allowed: true, remaining: Math.max(this.rpm - 1, 0) };
    }
    if (row.count >= this.rpm) {
      return { allowed: false, remaining: 0 };
    }
    this.upsertStmt.run({ key, count: row.count + 1, reset: currentWindow });
    return { allowed: true, remaining: Math.max(this.rpm - row.count - 1, 0) };
  }
}
