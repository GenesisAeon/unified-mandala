import React, { useEffect, useState } from 'react';
import fourierBridge, { connectFourierBridge } from '../api/fourierBridge';

const FourierMetricsViewer: React.FC = () => {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    const handler = (data: { id: string; svg: string }) => setSvg(data.svg);
    const ws = connectFourierBridge();
    fourierBridge.on('fourier:metrics-svg', handler);
    return () => {
      fourierBridge.off('fourier:metrics-svg', handler);
      (ws as any).close?.();
    };
  }, []);

  if (!svg) return <div>No metrics</div>;

  return <div aria-label="Fourier Metrics SVG" dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default FourierMetricsViewer;
