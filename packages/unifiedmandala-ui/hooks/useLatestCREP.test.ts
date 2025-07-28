import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useLatestCREP } from './useLatestCREP';

globalThis.fetch = jest.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({ value: 42 }) })
) as any;

test('loads latest CREP value', async () => {
  const { result } = renderHook(() => useLatestCREP());
  await act(async () => {
    await Promise.resolve();
  });
  expect(result.current.value).toBe(42);
  expect(result.current.error).toBeNull();
});
