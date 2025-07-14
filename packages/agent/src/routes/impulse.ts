import { Router } from 'express';

export const impulseRouter = Router();
export const impulseMetrics: Record<string, number[]> = {};

impulseRouter.post('/impulse/:idx/crep', (req, res) => {
  const { idx } = req.params;
  const value = Number(req.body?.value);
  if (!Number.isFinite(value)) {
    return res.status(400).json({ error: 'invalid value' });
  }
  if (!impulseMetrics[idx]) {
    impulseMetrics[idx] = [];
  }
  impulseMetrics[idx].push(value);
  res.json({ ok: true });
});

export default impulseRouter;
