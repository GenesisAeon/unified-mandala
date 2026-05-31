import React, { useMemo } from 'react';
import NodeHighlighter from './NodeHighlighter';
import TransitionAnimator from './TransitionAnimator';

// 4D-Tesserakt: 16 Ecken, 32 Kanten
// Projektion auf 2D via zwei verschachtelten Würfeln (innerer + äußerer Würfel)
// Kanten existieren zwischen Knoten mit Hamming-Distanz = 1

const OUTER_R = 120;
const INNER_R = 60;

// 8 Ecken des äußeren Würfels (0-7), 8 Ecken des inneren Würfels (8-15)
// Projektion: 3D → 2D via isometrischer Näherung
// Der äußere Würfel entspricht Bit-3=0, innerer Bit-3=1
function cubeVertices(r: number, cx: number, cy: number): [number, number][] {
  const a = r * 0.9;
  const b = r * 0.45;
  return [
    [cx - a, cy + b], // 0: 000
    [cx + a, cy + b], // 1: 001
    [cx + a, cy - b], // 2: 010
    [cx - a, cy - b], // 3: 011
    [cx - b, cy + a], // 4: 100
    [cx + b, cy + a], // 5: 101
    [cx + b, cy - a], // 6: 110
    [cx - b, cy - a], // 7: 111
  ];
}

export function buildTesseractEdges(): [number, number][] {
  const edges: [number, number][] = [];
  for (let a = 0; a < 16; a++) {
    for (let b = a + 1; b < 16; b++) {
      const diff = a ^ b;
      if (diff !== 0 && (diff & (diff - 1)) === 0) {
        // Genau 1 Bit unterschied → Hamming-Distanz = 1 → gültige Tesseraktkante
        edges.push([a, b]);
      }
    }
  }
  return edges; // 32 Kanten
}

function buildVertexPositions(cx: number, cy: number): [number, number][] {
  const outer = cubeVertices(OUTER_R, cx, cy);
  const inner = cubeVertices(INNER_R, cx, cy);
  // Vertex i: i < 8 → outer[i], i >= 8 → inner[i-8]
  return [...outer, ...inner];
}

interface HypercubeViewProps {
  currentStateId?: number;
  previousStateId?: number;
  width?: number;
  height?: number;
}

export default function HypercubeView({
  currentStateId = 0,
  previousStateId,
  width = 300,
  height = 300,
}: HypercubeViewProps) {
  const cx = width / 2;
  const cy = height / 2;
  const edges = useMemo(() => buildTesseractEdges(), []);
  const verts = useMemo(() => buildVertexPositions(cx, cy), [cx, cy]);

  const activeEdge = useMemo(() => {
    if (previousStateId == null) return null;
    return (
      edges.find(
        ([a, b]) =>
          (a === previousStateId && b === currentStateId) ||
          (b === previousStateId && a === currentStateId),
      ) ?? null
    );
  }, [edges, previousStateId, currentStateId]);

  return (
    <svg
      width={width}
      height={height}
      aria-label={`Tesserakt-Projektion, aktiver Zustand ${currentStateId}`}
      role="img"
    >
      {/* Kanten */}
      {edges.map(([a, b]) => {
        const [x1, y1] = verts[a];
        const [x2, y2] = verts[b];
        const isInner = a >= 8 && b >= 8;
        const isBridge = a < 8 !== b < 8;
        return (
          <line
            key={`${a}-${b}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isBridge ? '#334155' : isInner ? '#1e3a5f' : '#1e293b'}
            strokeWidth={isBridge ? 0.5 : 1}
          />
        );
      })}

      {/* Transition-Animation */}
      {activeEdge && (
        <TransitionAnimator
          x1={verts[activeEdge[0]][0]}
          y1={verts[activeEdge[0]][1]}
          x2={verts[activeEdge[1]][0]}
          y2={verts[activeEdge[1]][1]}
        />
      )}

      {/* Knoten */}
      {verts.map(([x, y], id) => (
        <NodeHighlighter
          key={id}
          x={x}
          y={y}
          id={id}
          isActive={id === currentStateId}
          isPrevious={id === previousStateId}
        />
      ))}
    </svg>
  );
}
