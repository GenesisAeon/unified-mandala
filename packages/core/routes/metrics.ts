import express from 'express';
import { REG, metricsText } from '../../../src/metrics/singleton';

const router = express.Router();

router.get('/metrics', async (_req, res) => {
  res.set('Content-Type', REG.contentType);
  res.end(await metricsText());
});

export default router;
