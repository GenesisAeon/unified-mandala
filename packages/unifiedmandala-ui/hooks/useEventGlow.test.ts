import { renderHook, act } from '@testing-library/react';
import { useEventGlow } from './useEventGlow';
import { GPTEventHub } from '../../gpt-bridges/GPTEventHub';

test('toggles glow on event', () => {
  const { result } = renderHook(() => useEventGlow('ping'));
  act(() => {
    GPTEventHub.emit('ping');
  });
  expect(result.current).toBe(true);
});
