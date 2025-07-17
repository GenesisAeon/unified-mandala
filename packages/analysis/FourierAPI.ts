import express from 'express';
import { FourierLayerEvents } from './FourierLayer';

export function createFourierAPI() {
  const app = express();
  app.get('/metrics', (_req, res) => {
    res.json(lastMetrics);
  });
  return app;
}

let lastMetrics: any = null;
FourierLayerEvents.on('metrics', data => {
  lastMetrics = data;
});
