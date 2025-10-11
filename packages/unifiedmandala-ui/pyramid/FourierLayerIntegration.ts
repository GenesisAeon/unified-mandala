import { useEffect, useState } from 'react';
import bridge, { connectFourierLayerBridge } from '../events/FourierLayerBridge';

export interface FourierMetricEvent {
  id: string;
  metrics: any;
}

export function useFourierLayerMetrics() {
  const [metrics, setMetrics] = useState<FourierMetricEvent[]>([]);

  useEffect(() => {
    const handle = (data: any) => {
      setMetrics((m) => [...m, data]);
    };
    bridge.on('fourier:metrics', handle);
    const ws = connectFourierLayerBridge();
    return () => {
      bridge.off('fourier:metrics', handle);
      ws.close();
    };
  }, []);

  return metrics;
}
