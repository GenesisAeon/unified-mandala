export interface Diagnostic {
  line: number;
  column: number;
  message: string;
  code: string;
  severity: 'error' | 'warning';
}

export class AeonDiagnostics {
  private diagnostics: Diagnostic[] = [];

  report(d: Diagnostic): void {
    this.diagnostics.push(d);
  }

  getAll(): Diagnostic[] {
    return this.diagnostics;
  }
}
