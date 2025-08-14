export interface ErrorRecord {
  error: Error;
  timestamp: number;
}

export class ErrorReportingSystem {
  private records: ErrorRecord[] = [];

  report(e: Error) {
    console.error(e);
    this.records.push({ error: e, timestamp: Date.now() });
  }

  getErrors(): ErrorRecord[] {
    return this.records;
  }

  clear() {
    this.records = [];
  }
}
