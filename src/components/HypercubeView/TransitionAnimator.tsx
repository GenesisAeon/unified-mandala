import React from 'react';

interface TransitionAnimatorProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// Animiert einen einzelnen 1-Bit-Übergang entlang der Kante
export default function TransitionAnimator({ x1, y1, x2, y2 }: TransitionAnimatorProps) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 2">
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="-18"
        dur="0.6s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-opacity"
        values="1;0.4;1"
        dur="0.6s"
        repeatCount="indefinite"
      />
    </line>
  );
}
