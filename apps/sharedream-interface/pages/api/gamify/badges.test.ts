/** @jest-environment node */
import handler from './badges';

test('returns badges', () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  handler({} as any, { status } as any);
  expect(status).toHaveBeenCalledWith(200);
  expect(json).toHaveBeenCalledWith({
    badges: [
      { id: 'first-pointer', name: 'First C Pointer reversed' },
      { id: 'hamster-pro', name: 'Hamster AI-Pro' },
    ],
  });
});
