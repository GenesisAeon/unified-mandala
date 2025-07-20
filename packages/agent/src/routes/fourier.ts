import { Router } from 'express';
import { FourierLayer } from '../../../analysis/FourierLayer';

export const fourierRouter = Router();

fourierRouter.post('/fourier/analyze', (req, res) => {
  const { data = [], depth = 1 } = req.body || {};
  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'data must be an array' });
  }
  const layer = new FourierLayer('api', 1, data, { depth });
  const result = layer.analyze();
  res.json(result.metrics);
});

export default fourierRouter;
