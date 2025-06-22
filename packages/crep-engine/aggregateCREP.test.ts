import { aggregateCREP } from './aggregateCREP';

const sample = [
  { C: 1, R: 1, E: 1, P: 1, timestamp: new Date() },
  { C: 3, R: 3, E: 3, P: 3, timestamp: new Date() }
];

test('averages crep entries', () => {
  const result = aggregateCREP(sample as any);
  expect(result.C).toBe(2);
  expect(result.R).toBe(2);
  expect(result.E).toBe(2);
  expect(result.P).toBe(2);
});
