import React, { useEffect, useRef, useState } from 'react';
import type { Q4State } from '../GrayGrid';
import { stateFromId } from '../GrayGrid';

export interface FrameEvent {
  subject: string; // e.g. "ga.frame.1011"
  stateId: number;
  timestamp: number;
  payload?: Record<string, unknown>;
}

interface StreamMonitorProps {
  natsUrl?: string;
  maxEvents?: number;
  onStateChange?: (state: Q4State) => void;
}

// WebSocket-Bridge zu NATS für ga.frame.*-Subjects
// Verbindet sich mit einem NATS WebSocket Proxy
export function useFrameStream(
  natsUrl: string | undefined,
  onStateChange?: (state: Q4State) => void,
) {
  const [events, setEvents] = useState<FrameEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!natsUrl) return;

    let ws: WebSocket;
    try {
      ws = new WebSocket(natsUrl);
      wsRef.current = ws;
    } catch {
      return;
    }

    ws.onopen = () => {
      setConnected(true);
      // Subscribed auf alle 16 ga.frame.*-Subjects
      ws.send(JSON.stringify({ type: 'subscribe', subject: 'ga.frame.>' }));
    };

    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data as string) as {
          subject?: string;
          data?: unknown;
        };
        const subject = data.subject ?? '';
        const match = subject.match(/^ga\.frame\.([01]{4})$/);
        if (!match) return;
        const stateId = parseInt(match[1], 2);
        const event: FrameEvent = {
          subject,
          stateId,
          timestamp: Date.now(),
          payload:
            typeof data.data === 'object' && data.data !== null
              ? (data.data as Record<string, unknown>)
              : undefined,
        };
        setEvents((prev) => [event, ...prev].slice(0, 50));
        onStateChange?.(stateFromId(stateId));
      } catch {
        // Unbekanntes Nachrichtenformat ignorieren
      }
    };

    return () => ws.close();
  }, [natsUrl]);

  return { events, connected };
}

export default function StreamMonitor({
  natsUrl,
  maxEvents = 10,
  onStateChange,
}: StreamMonitorProps) {
  const { events, connected } = useFrameStream(natsUrl, onStateChange);
  const visible = events.slice(0, maxEvents);

  return (
    <div aria-label="NATS ga.frame.* Live-Monitor">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span
          aria-label={connected ? 'verbunden' : 'getrennt'}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: connected ? '#22c55e' : '#ef4444',
            display: 'inline-block',
          }}
        />
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {natsUrl ? (connected ? 'verbunden' : 'getrennt') : 'keine URL konfiguriert'}
        </span>
      </div>
      {visible.length === 0 ? (
        <p style={{ fontSize: '0.75rem', color: '#475569' }}>Warte auf ga.frame.*-Events…</p>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          {visible.map((ev, i) => (
            <li
              key={`${ev.subject}-${ev.timestamp}-${i}`}
              style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#94a3b8' }}
            >
              <span style={{ color: '#22d3ee' }}>{ev.subject}</span>
              {' · '}
              <span style={{ color: '#64748b' }}>
                {new Date(ev.timestamp).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
