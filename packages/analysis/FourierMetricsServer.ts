import { FourierLayerEvents } from './FourierLayer';
import { WebSocketServer } from 'ws';

export function startFourierMetricsServer(port = 4010) {
  const wss = new WebSocketServer({ port });
  wss.on('connection', ws => {
    const metricsListener = (data: any) => {
      ws.send(JSON.stringify({ type: 'fourier-metrics', data }));
    };
    const svgListener = (data: any) => {
      ws.send(JSON.stringify({ type: 'fourier-metrics-svg', data }));
    };
    FourierLayerEvents.on('metrics', metricsListener);
    FourierLayerEvents.on('metrics-svg', svgListener);
    ws.on('close', () => {
      FourierLayerEvents.off('metrics', metricsListener);
      FourierLayerEvents.off('metrics-svg', svgListener);
    });
  });
  return wss;
}
