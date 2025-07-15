import express from 'express';
import http from 'http';
import { metricsMiddleware, metricsEndpoint } from '../../packages/core/middleware/metrics';
import { FourierLayerEvents, EmergenceMetrics } from '../../packages/analysis/FourierLayer';

let latestMetrics: Record<string, EmergenceMetrics> = {};

export function startServer(port = 4100) {
  const app = express();
  app.use(metricsMiddleware);
  app.get('/metrics', metricsEndpoint);

  app.get('/fourier/latest', (_req, res) => {
    res.json(latestMetrics);
  });

  const { Server } = require('ws');
  const server = http.createServer(app);
  const wss = new Server({ server });

  wss.on('connection', (socket: any) => {
    // send the most recent metrics to new clients immediately
    Object.entries(latestMetrics).forEach(([id, metrics]) => {
      socket.send(JSON.stringify({ type: 'fourier-metrics', id, metrics }));
    });

    const handler = (payload: any) => {
      socket.send(JSON.stringify(payload));
    };
    FourierLayerEvents.on('metrics', handler);
    socket.on('close', () => FourierLayerEvents.off('metrics', handler));
  });

  FourierLayerEvents.on('metrics', ({ id, metrics }) => {
    latestMetrics[id] = metrics;
  });

  server.listen(port, () => {
    console.log(`Fourier metrics listening on ${port}`);
  });

  function stop() {
    wss.close();
    server.close();
  }

  return { app, server, wss, stop };
}
