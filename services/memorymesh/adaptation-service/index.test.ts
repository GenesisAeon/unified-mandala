import { HabitWeaver } from './index';

test('tracks habits', () => {
  const hw = new HabitWeaver();
  hw.observe('open');
  hw.observe('open');
  expect(hw.getHabits()).toEqual({ open: 2 });
});
