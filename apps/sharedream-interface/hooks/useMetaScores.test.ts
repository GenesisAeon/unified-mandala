import { renderHook, act } from '@testing-library/react';
import { useMetaScores } from './useMetaScores';

beforeEach(() => {
  (global as any).fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve({ scores: [{ id: 't', value: 0.5 }] }) })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test('loads meta scores', async () => {
  const { result } = renderHook(() => useMetaScores());
  await act(async () => {});
  expect(result.current[0]).toEqual({ id: 't', value: 0.5 });
});
