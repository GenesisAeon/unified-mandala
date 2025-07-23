import React, { useRef } from 'react';
import MandalaEventBridge from '../events/MandalaEventBridge';

const BlackboxMandala: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleExportSVG = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml' });
    MandalaEventBridge.emit('mandala:export-svg', { svg: source });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blackbox-mandala.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={svgRef}
        width={200}
        height={200}
        viewBox="0 0 100 100"
        aria-label="Blackbox Mandala"
      >
        <circle cx="50" cy="50" r="40" stroke="#000" fill="none" />
      </svg>
      <button onClick={handleExportSVG} className="mt-2 p-2 bg-gray-700 text-white">
        Export SVG
      </button>
    </div>
  );
};

export default BlackboxMandala;
