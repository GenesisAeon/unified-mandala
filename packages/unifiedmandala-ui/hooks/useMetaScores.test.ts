import { renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useMetaScores } from './useMetaScores';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve([{ layer: 'x', score: 0.4 }]) })
  ) as any;
});

test('fetches meta scores', async () => {
  const { result } = renderHook(() => useMetaScores('/test'));
  await waitFor(() => expect(result.current.length).toBeGreaterThan(0));
  expect(result.current[0].layer).toBe('x');
});
