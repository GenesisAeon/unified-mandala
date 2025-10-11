import { renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useHybridService } from './useHybridService';

test('selects response with highest CREP', async () => {
  const responses: Record<string, any> = {
    '/a': { result: 'a', crep: 0.2 },
    '/b': { result: 'b', crep: 0.9 },
    '/c': { result: 'c', crep: 0.5 },
  };

  global.fetch = jest.fn((url: string) =>
    Promise.resolve({ json: () => Promise.resolve(responses[url]) }),
  ) as any;

  const { result } = renderHook(() => useHybridService(['/a', '/b', '/c']));
  await waitFor(() => expect(result.current).not.toBeNull());
  expect(result.current?.result).toBe('b');
  expect((global.fetch as any).mock.calls.length).toBeGreaterThanOrEqual(3);
});
