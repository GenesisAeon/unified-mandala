import express from 'express';
import { FourierLayer, FourierLayerEvents } from './FourierLayer';

export function createFourierAPI() {
  const app = express();
  app.use(express.json());
  app.get('/metrics', (_req, res) => {
    res.json(lastMetrics);
  });
  app.post('/analyze', (req, res) => {
    const { id = 'input', depth = 1, data = [] } = req.body || {};
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: 'data must be an array' });
    }
    const layer = new FourierLayer(id, 1, data, { depth });
    const result = layer.analyze();
    res.json(result.metrics);
  });
  return app;
}

let lastMetrics: any = null;
FourierLayerEvents.on('metrics', (data) => {
  lastMetrics = data;
});
