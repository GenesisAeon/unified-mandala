import { FourierLayerEvents } from './FourierLayer';
const WebSocketServer = require('ws').Server;

interface MetricPayload {
  type: 'fourier-metrics' | 'fourier-metrics-svg';
  data: any;
}

export function startFourierMetricsServer(port = 4010) {
  const wss = new WebSocketServer({ port });

  let lastMetrics: any = null;
  let lastSvg: any = null;

  FourierLayerEvents.on('metrics', (data: any) => {
    lastMetrics = data;
    const payload: MetricPayload = { type: 'fourier-metrics', data };
    const msg = JSON.stringify(payload);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    }
  });

  FourierLayerEvents.on('metrics-svg', (data: any) => {
    lastSvg = data;
    const payload: MetricPayload = { type: 'fourier-metrics-svg', data };
    const msg = JSON.stringify(payload);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    }
  });

  wss.on('connection', (ws: any) => {
    if (lastMetrics) {
      ws.send(JSON.stringify({ type: 'fourier-metrics', data: lastMetrics }));
    }
    if (lastSvg) {
      ws.send(JSON.stringify({ type: 'fourier-metrics-svg', data: lastSvg }));
    }
  });
  return wss;
}
