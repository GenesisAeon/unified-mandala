declare module 'better-sqlite3' {
  interface Statement<T = any> {
    all(...params: any[]): T[];
    get(...params: any[]): T | undefined;
    run(...params: any[]): RunResult;
  }

  interface RunResult {
    changes: number;
    lastInsertRowid: number | bigint;
  }

  interface DatabaseOptions {
    readonly?: boolean;
    fileMustExist?: boolean;
    timeout?: number;
  }

  interface Database {
    prepare<T = any>(sql: string): Statement<T>;
    exec(sql: string): this;
    pragma<T = unknown>(pragma: string, options?: { simple?: boolean }): T;
    close(): void;
  }

  interface BetterSqlite3Constructor {
    new (filename: string, options?: DatabaseOptions): Database;
    (filename: string, options?: DatabaseOptions): Database;
  }

  const BetterSqlite3: BetterSqlite3Constructor;
  export = BetterSqlite3;
}
