import { renderHook, act } from '@testing-library/react';
import bridge from '../events/FourierLayerBridge';
import { useFourierLayerMetrics } from './FourierLayerIntegration';

global.WebSocket = class {
  onmessage: ((ev: { data: string }) => void) | null = null;
  constructor(public url: string) {}
  send(data: string) {
    this.onmessage?.({ data });
  }
  close() {}
} as any;

test('collects fourier metrics', () => {
  const { result } = renderHook(() => useFourierLayerMetrics());
  act(() => {
    bridge.emit('fourier:metrics', { id: 'm1', metrics: { a: 1 } });
  });
  expect(result.current).toEqual([{ id: 'm1', metrics: { a: 1 } }]);
});
