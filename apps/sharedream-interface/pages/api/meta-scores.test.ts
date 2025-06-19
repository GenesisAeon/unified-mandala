/** @jest-environment node */
import handler from './meta-scores';

test('returns meta scores', () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const req = {} as any;
  const res = { status } as any;

  handler(req, res);

  expect(status).toHaveBeenCalledWith(200);
  expect(json).toHaveBeenCalledWith({
    scores: [
      { id: 'meta1', value: 0.75 },
      { id: 'meta2', value: 0.82 },
    ],
  });
});
