import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useBreakpoint } from './useBreakpoint';

test('detects mobile breakpoint', () => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 400 });
  const { result } = renderHook(() => useBreakpoint(500));
  expect(result.current).toBe(true);
  act(() => {
    window.innerWidth = 600;
    window.dispatchEvent(new Event('resize'));
  });
  expect(result.current).toBe(false);
});
