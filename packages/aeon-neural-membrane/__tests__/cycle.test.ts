import { AeonUniversalMembrane } from '../aeonUniversalMembrane';

const data: [number, number][] = [[115, 66], [175, 78]];
const answers = [1, 0];

it('runs self reflect cycle', () => {
  const mem = new AeonUniversalMembrane(1);
  mem.selfReflectCycle(3, data, answers, 'hello', 0);
  expect(mem.getHistory().length).toBe(3);
  expect(mem.depth).toBeGreaterThan(1);
});
