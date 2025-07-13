import { MetricsStore } from './MetricsStore';
import { metrics } from '@opentelemetry/api';

const recordMock = jest.fn();
jest.mock('@opentelemetry/api', () => ({
  metrics: {
    getMeter: () => ({ createHistogram: () => ({ record: recordMock }) })
  }
}));

test('computes average', () => {
  const ms = new MetricsStore();
  ms.add(1); ms.add(3);
  expect(ms.average()).toBe(2);
});

test('records values via OpenTelemetry', () => {
  const ms = new MetricsStore();
  ms.add(5);
  expect(recordMock).toHaveBeenCalledWith(5);
});
