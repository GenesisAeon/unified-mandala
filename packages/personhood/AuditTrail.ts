import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';
import { dirname, resolve } from 'path';

export interface AuditEvent {
  personId: string;
  action: string;
  [key: string]: unknown;
}

function getLogPath(): string {
  const log = process.env.PERSONHOOD_AUDIT_LOG || 'personhood.audit.log';
  const full = resolve(log);
  const dir = dirname(full);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return full;
}

export class AuditTrail {
  static record(event: AuditEvent): void {
    const timestamp = new Date().toISOString();
    const payload = { ...event, timestamp };
    const signature = createHash('sha256')
      .update(JSON.stringify(payload))
      .digest('hex');
    appendFileSync(getLogPath(), JSON.stringify({ ...payload, signature }) + '\n');
  }
}
