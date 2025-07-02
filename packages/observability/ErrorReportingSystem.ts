export class ErrorReportingSystem {
  errors: string[] = [];
  report(e: Error) { this.errors.push(e.message); }
}
