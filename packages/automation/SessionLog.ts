import { appendFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

export interface SessionEvent {
  timestamp?: string;
  [key: string]: any;
}

const DEFAULT_LOG_DIR = path.resolve(process.cwd(), 'logs');
const DEFAULT_LOG_FILE = path.join(DEFAULT_LOG_DIR, 'automation-session.jsonl');

/**
 * Append an automation session event to a JSONL log.
 * Ensures the directory exists and attaches an ISO timestamp.
 */
export function appendSessionEvent(event: SessionEvent, filePath: string = DEFAULT_LOG_FILE) {
  const dir = path.dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const entry = { timestamp: event.timestamp ?? new Date().toISOString(), ...event };
  appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf8');
}

export default { appendSessionEvent };
