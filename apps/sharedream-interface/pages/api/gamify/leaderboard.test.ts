/** @jest-environment node */
import handler from './leaderboard';

test('returns leaderboard', () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  handler({} as any, { status } as any);
  expect(status).toHaveBeenCalledWith(200);
  expect(json).toHaveBeenCalledWith({
    leaderboard: [
      { user: 'alice', score: 12 },
      { user: 'bob', score: 9 },
    ],
  });
});
