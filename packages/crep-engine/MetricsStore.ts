import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('crep-engine');
const valueHistogram = meter.createHistogram('crep_value', {
  description: 'CREP metric values'
});

export class MetricsStore {
  private values: number[] = [];
  add(value: number) {
    this.values.push(value);
    valueHistogram.record(value);
  }

  average(): number {
    if (this.values.length === 0) return 0;
    return this.values.reduce((a, b) => a + b, 0) / this.values.length;
  }
}

export { valueHistogram };
