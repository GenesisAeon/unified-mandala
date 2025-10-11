import React from 'react';

export interface BoundaryVisualDebuggerProps {
  active: string[];
  collisions: string[];
}

export default function BoundaryVisualDebugger({
  active,
  collisions,
}: BoundaryVisualDebuggerProps) {
  return (
    <div>
      <h2>Active Boundaries</h2>
      <ul>
        {active.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      {collisions.length > 0 && (
        <>
          <h3>Collisions</h3>
          <ul>
            {collisions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
