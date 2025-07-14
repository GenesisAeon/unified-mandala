import express from 'express';
import { impulseMetrics } from '../../agent/src/routes/impulse';

const router = express.Router();

router.get('/api/meta-scores', (_req: any, res: any) => {
  const scores = Object.entries(impulseMetrics).map(([idx, values]) => {
    const sum = values.reduce((a, b) => a + b, 0);
    const avgResonance = values.length ? sum / values.length : 0;
    return { idx, avgResonance };
  });
  res.json({ scores });
});

export default router;
