import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

export function recordMetric(name: string, value: number) {
  diag.debug(`[metric] ${name} = ${value}`);
}
