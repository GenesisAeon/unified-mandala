import { appendJsonl, readJsonl } from './jsonlLogger';
import { randomUUID } from 'crypto';

export interface RunLogEntry<T = any> {
  run_id: string;
  timestamp: string;
  event: string;
  data?: T;
}

/**
 * RunLogger provides append only JSONL based logging for simulation runs.
 * Each entry is tagged with a run_id so multiple runs can share a log file.
 */
export class RunLogger {
  constructor(private filePath: string, private runId: string = randomUUID()) {}

  log(event: string, data?: any) {
    const entry: RunLogEntry = {
      run_id: this.runId,
      timestamp: new Date().toISOString(),
      event,
      data,
    };
    appendJsonl(this.filePath, entry);
    return entry;
  }

  get id() {
    return this.runId;
  }

  static read(filePath: string): RunLogEntry[] {
    return readJsonl<RunLogEntry>(filePath);
  }
}
