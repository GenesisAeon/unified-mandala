import { PresenceIndicator } from './PresenceIndicator';

test('tracks join and leave', () => {
  const p = new PresenceIndicator();
  p.join('a');
  p.leave('a');
  expect(p.count()).toBe(0);
});
