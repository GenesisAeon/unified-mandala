import React, { useEffect, useRef } from 'react';

export interface ResonanceOverlayProps {
  resonance: number; // 0-100
}

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  transition: 'opacity 0.3s ease',
};

const activeStyle: React.CSSProperties = {
  background: 'radial-gradient(circle, rgba(255,255,0,0.6) 0%, rgba(255,255,0,0) 70%)',
  opacity: 1,
};

export default function ResonanceOverlay({ resonance }: ResonanceOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      if (resonance > 80) {
        Object.assign(ref.current.style, activeStyle);
      } else {
        ref.current.style.background = 'transparent';
        ref.current.style.opacity = '0';
      }
    }
  }, [resonance]);

  return <div ref={ref} data-testid="resonance-overlay" style={{ ...overlayStyle, opacity: 0 }} />;
}
