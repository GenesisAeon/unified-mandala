import { KarmaBalance } from './KarmaBalance';

test('accumulates karma points', () => {
  const karma = new KarmaBalance();
  karma.add(5);
  karma.add(-2);
  expect(karma.getBalance()).toBe(3);
});
