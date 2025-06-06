import { CREPWirkungstracker } from './CREPWirkungstracker';
import { CREPEntry } from '../crep-engine/types';

test('tracks average effect', () => {
  const tracker = new CREPWirkungstracker();
  const entry: CREPEntry = { timestamp: new Date(), C: 1, R: 1, E: 1, P: 1 };
  tracker.addEntry(entry);
  tracker.addEntry({ ...entry, C: 3 });
  const avg = tracker.getAverage();
  expect(avg).toBeCloseTo(1.5);
});
