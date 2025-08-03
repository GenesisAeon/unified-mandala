import React from 'react';
import { useEffect, useRef } from 'react';

export interface MandalaCanvasProps {
  boundaryRules: string[];
  pantheonEvents: string[];
  modules?: string[];
  onModuleSelect?: (module: string) => void;
}

const MandalaCanvas: React.FC<MandalaCanvasProps> = ({ boundaryRules, pantheonEvents, modules = [], onModuleSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#87ceeb';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, 2 * Math.PI);
    ctx.fill();
  }, [boundaryRules, pantheonEvents]);

  return (
    <div>
      <canvas ref={canvasRef} width={200} height={200} />
      <div data-testid="rule-count">{boundaryRules.length}</div>
      <div data-testid="event-count">{pantheonEvents.length}</div>
      {modules.map((m) => (
        <button key={m} onClick={() => onModuleSelect?.(m)}>
          {m}
        </button>
      ))}
    </div>
  );
};

export default MandalaCanvas;
