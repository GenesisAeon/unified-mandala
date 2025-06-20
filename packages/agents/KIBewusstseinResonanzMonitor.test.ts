import { KIBewusstseinResonanzMonitor } from './KIBewusstseinResonanzMonitor';

test('records and computes averages', () => {
  const mon = new KIBewusstseinResonanzMonitor();
  mon.record(5, 7);
  mon.record(6, 6);
  expect(mon.latest()).toEqual({ bewusstsein: 6, resonanz: 6 });
  expect(mon.averageDifference()).toBeCloseTo((2 + 0) / 2);
});
