import React, { useRef } from 'react';

export default function BlackboxMandala() {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleExport = () => {
    if (!svgRef.current) return;
    const svgString = new XMLSerializer().serializeToString(svgRef.current);
    const event = new CustomEvent('mandala:export', { detail: svgString });
    window.dispatchEvent(event);
  };

  return (
    <div>
      <svg ref={svgRef} width={200} height={200} aria-label="Blackbox Mandala">
        <circle cx="100" cy="100" r="80" fill="#111" stroke="#0ff" />
      </svg>
      <button onClick={handleExport}>Export</button>
    </div>
  );
}
