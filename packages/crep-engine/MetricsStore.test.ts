const recordMock = jest.fn();
jest.doMock('@opentelemetry/api', () => ({
  metrics: {
    getMeter: () => ({ createHistogram: () => ({ record: recordMock }) })
  }
}));
const { metrics } = require('@opentelemetry/api');
const { MetricsStore } = require('./MetricsStore');

beforeEach(() => {
  recordMock.mockClear();
});

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
