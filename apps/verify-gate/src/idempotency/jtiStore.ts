import Database from 'better-sqlite3';

type BetterSqliteDatabase = InstanceType<typeof Database>;

export class JtiStore {
  private readonly insertStmt;
  private readonly purgeStmt;

  constructor(private readonly db: BetterSqliteDatabase) {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS jti (
        j TEXT PRIMARY KEY,
        exp INTEGER NOT NULL
      )
    `);
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_jti_exp ON jti (exp)');
    this.insertStmt = this.db.prepare('INSERT OR IGNORE INTO jti (j, exp) VALUES (@j, @exp)');
    this.purgeStmt = this.db.prepare('DELETE FROM jti WHERE exp <= @cutoff LIMIT @limit');
  }

  seen(jti: string, expSeconds: number): boolean {
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (expSeconds <= nowSeconds) {
      return false;
    }
    const result = this.insertStmt.run({ jti, j: jti, exp: expSeconds });
    return result.changes === 0;
  }

  purge(limit = 1000): void {
    try {
      const nowSeconds = Math.floor(Date.now() / 1000);
      this.purgeStmt.run({ cutoff: nowSeconds, limit });
    } catch (error) {
      console.error('[verify-gate] failed to purge jti entries', error);
    }
  }
}
