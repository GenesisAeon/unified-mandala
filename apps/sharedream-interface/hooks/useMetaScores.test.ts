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
  expect(result.current.loading).toBe(true);
  await act(async () => {});
  expect(result.current.loading).toBe(false);
  expect(result.current.scores[0]).toEqual({ id: 't', value: 0.5 });
  expect(result.current.error).toBeNull();
});

test('handles fetch error', async () => {
  (global as any).fetch = jest.fn(() => Promise.reject('fail'));
  const { result } = renderHook(() => useMetaScores());
  await act(async () => {});
  expect(result.current.error).toBe('Fehler beim Laden der Meta-Scores');
  expect(result.current.loading).toBe(false);
  expect(result.current.scores).toEqual([]);
});

test('retry fetches scores after failure', async () => {
  (global as any).fetch = jest.fn(() => Promise.reject('fail'));
  const { result } = renderHook(() => useMetaScores());
  await act(async () => {});
  expect(result.current.error).toBe('Fehler beim Laden der Meta-Scores');

  (global as any).fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve({ scores: [{ id: 'r', value: 0.9 }] }) })
  );

  await act(async () => {
    await result.current.retry();
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeNull();
  expect(result.current.scores[0]).toEqual({ id: 'r', value: 0.9 });
});
