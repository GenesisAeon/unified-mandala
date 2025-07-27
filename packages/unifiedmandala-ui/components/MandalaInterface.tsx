import React from 'react';

export interface MandalaInterfaceProps {
  title?: string;
}

export default function MandalaInterface({ title = 'Mandala Interface' }: MandalaInterfaceProps) {
  return (
    <div className="mandala-interface">
      <h2>{title}</h2>
      <canvas aria-label="mandala-canvas" width={300} height={300}></canvas>
    </div>
  );
}
