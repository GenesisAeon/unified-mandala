import { renderHook, act } from '@testing-library/react';
import { useLiveEvents } from './useLiveEvents';

class MockWebSocket {
  static instances: MockWebSocket[] = [];
  onmessage: ((ev: { data: string }) => void) | null = null;
  onerror: ((err: any) => void) | null = null;
  constructor(public url: string) {
    MockWebSocket.instances.push(this);
  }
  close() {}
  emit(data: any) {
    this.onmessage?.({ data: JSON.stringify(data) });
  }
}

(global as any).WebSocket = MockWebSocket as any;

test('collects events from WebSocket', () => {
  const { result } = renderHook(() => useLiveEvents('ws://example'));
  const ws = MockWebSocket.instances[0];
  act(() => {
    ws.emit({ type: 'test', value: 1 });
  });
  expect(result.current.events).toEqual([{ type: 'test', value: 1 }]);
});
