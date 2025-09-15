import fs from 'node:fs';
import path from 'node:path';
import { ensureDir, getRepoRoot } from './utils/paths.js';

export type AuditEntry = {
  ts: string;
  tool: string;
  ok: boolean;
  ms: number;
  paramsHash?: string;
  error?: string;
  meta?: Record<string, unknown>;
};

export class AuditLogger {
  private stream: fs.WriteStream;

  constructor(filename = 'audit.ndjson') {
    const baseDir = path.resolve(getRepoRoot(), 'servers', 'mandala-mcp', 'logs');
    ensureDir(baseDir);
    const file = path.join(baseDir, filename);
    this.stream = fs.createWriteStream(file, { flags: 'a' });
  }

  write(entry: AuditEntry) {
    const payload = {
      ...entry,
      meta: {
        version: entry.meta?.version ?? '0.1.0',
        node: process.version,
        pid: process.pid,
        ...(entry.meta ?? {})
      }
    } satisfies AuditEntry;
    this.stream.write(`${JSON.stringify(payload)}\n`);
  }
}
