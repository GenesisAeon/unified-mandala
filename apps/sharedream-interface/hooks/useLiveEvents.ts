import { useEffect, useRef, useState } from 'react';

export interface LiveEvent {
  type?: string;
  [key: string]: any;
}

/**
 * useLiveEvents subscribes to a WebSocket stream and accumulates
 * incoming events. The WebSocket URL defaults to the environment
 * variable `NEXT_PUBLIC_EVENTS_WS_URL` if available.
 */
export function useLiveEvents(url?: string) {
  const wsUrl = url || process.env.NEXT_PUBLIC_EVENTS_WS_URL || '';
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!wsUrl) return;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        setEvents((prev) => [...prev, data]);
      } catch (err) {
        console.error('Invalid event data', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error', err);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [wsUrl]);

  return { events };
}

export default useLiveEvents;
