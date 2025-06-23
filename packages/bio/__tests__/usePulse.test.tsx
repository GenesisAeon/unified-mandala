import { renderHook, act } from '@testing-library/react';
import { usePulse } from '../usePulse';

jest.useFakeTimers();

test('updates pulse over time', () => {
  const { result } = renderHook(() => usePulse(500));
  const initial = result.current;
  act(() => {
    jest.advanceTimersByTime(500);
  });
  expect(result.current).not.toBe(initial);
});
