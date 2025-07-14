import { FourierLayerEvents } from './FourierLayer';
const WebSocket = require('ws');

export function startFourierMetricsServer(port = 4010) {
  const WSClass = WebSocket.WebSocketServer || WebSocket.Server;
  const wss = new WSClass({ port });
  wss.on('connection', (ws: any) => {
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
