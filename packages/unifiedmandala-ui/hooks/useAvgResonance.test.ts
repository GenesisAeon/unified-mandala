import { renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAvgResonance } from './useAvgResonance';

global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve({ scores: [{ idx: '1', avgResonance: 0.8 }] }) })
) as any;

test('fetches avg resonance', async () => {
  const { result } = renderHook(() => useAvgResonance('1', '/api/meta-scores'));
  await waitFor(() => expect(result.current).toBeGreaterThan(0));
  expect(result.current).toBe(0.8);
});
