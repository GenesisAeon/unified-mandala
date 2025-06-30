import { scheduleAdaptive, getInterval } from './scheduler';

jest.useFakeTimers();

describe('adaptive scheduler', () => {
  it('adjusts interval after first run', async () => {
    const counts = [11];
    const getCount = jest.fn().mockImplementation(() => Promise.resolve(counts.shift() || 0));
    const run = jest.fn().mockResolvedValue(undefined);

    scheduleAdaptive(getCount, run);

    expect(getInterval()).toBe(6 * 3600 * 1000);

    jest.advanceTimersByTime(6 * 3600 * 1000);
    await Promise.resolve();
    expect(getInterval()).toBe(2 * 3600 * 1000);
  });
});
