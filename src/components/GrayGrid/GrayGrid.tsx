import React from 'react';
import GridCell from './GridCell';

// Kanonische Gray-Code-Traversal: g(n) = n XOR (n >> 1)
// Jede benachbarte Zelle unterscheidet sich exakt um 1 Bit.
export const GRAY_ORDER: readonly number[] = [0, 1, 3, 2, 6, 7, 5, 4, 12, 13, 15, 14, 10, 11, 9, 8];

// PHI_APPROX = 1.6 (Engineering-Näherung ≈ Φ = 1.6180339...)
const PHI_APPROX = 1.6;

export interface Q4State {
  C: 0 | 1;
  R: 0 | 1;
  E: 0 | 1;
  P: 0 | 1;
  readonly id: number;
  readonly binary: string;
}

export function stateFromId(id: number): Q4State {
  const C = ((id >> 3) & 1) as 0 | 1;
  const R = ((id >> 2) & 1) as 0 | 1;
  const E = ((id >> 1) & 1) as 0 | 1;
  const P = (id & 1) as 0 | 1;
  return { C, R, E, P, id, binary: id.toString(2).padStart(4, '0') };
}

interface GrayGridProps {
  currentStateId?: number;
  onStateClick?: (id: number) => void;
}

export default function GrayGrid({ currentStateId = 0, onStateClick }: GrayGridProps) {
  return (
    <div
      role="grid"
      aria-label="Q4 Gray-Code-Grid (4×4)"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: `${PHI_APPROX}rem`,
        padding: `${PHI_APPROX}rem`,
      }}
    >
      {GRAY_ORDER.map((id) => (
        <GridCell
          key={id}
          state={stateFromId(id)}
          isActive={id === currentStateId}
          onClick={onStateClick ? () => onStateClick(id) : undefined}
        />
      ))}
    </div>
  );
}
