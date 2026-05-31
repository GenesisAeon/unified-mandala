import React from 'react';
import type { FrameEvent } from './StreamMonitor';

interface FrameHistoryProps {
  events: FrameEvent[];
  maxItems?: number;
}

// Zeigt die letzten N Frame-Übergänge mit Hamming-Distanz-Anzeige
export default function FrameHistory({ events, maxItems = 8 }: FrameHistoryProps) {
  const visible = events.slice(0, maxItems);

  function hammingDistance(a: number, b: number): number {
    let diff = a ^ b;
    let count = 0;
    while (diff) {
      count += diff & 1;
      diff >>= 1;
    }
    return count;
  }

  return (
    <div aria-label="Frame-Übergangs-Historie">
      <h4 style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.4rem 0' }}>
        Frame-Historie
      </h4>
      {visible.length < 2 ? (
        <p style={{ fontSize: '0.7rem', color: '#475569' }}>Noch keine Übergänge.</p>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
          }}
        >
          {visible.slice(0, -1).map((ev, i) => {
            const prev = visible[i + 1];
            const hd = hammingDistance(ev.stateId, prev.stateId);
            const isValid = hd === 1;
            return (
              <li
                key={`${ev.timestamp}-${i}`}
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  display: 'flex',
                  gap: '0.4rem',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: '#64748b' }}>
                  {prev.stateId.toString(2).padStart(4, '0')}
                </span>
                <span style={{ color: '#334155' }}>→</span>
                <span style={{ color: '#94a3b8' }}>{ev.stateId.toString(2).padStart(4, '0')}</span>
                <span
                  aria-label={`Hamming-Distanz ${hd}${isValid ? ' (gültig)' : ' (ungültig)'}`}
                  style={{
                    fontSize: '0.6rem',
                    padding: '0 0.25rem',
                    borderRadius: '2px',
                    background: isValid ? 'rgba(34,211,238,0.15)' : 'rgba(239,68,68,0.15)',
                    color: isValid ? '#22d3ee' : '#ef4444',
                  }}
                >
                  HD={hd}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
