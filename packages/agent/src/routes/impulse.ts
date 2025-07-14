import { Router } from 'express';
export const impulseRouter = Router();

impulseRouter.post('/impulse/:idx/crep', (req, res) => {
  // TODO implement update logic
  res.json({ ok: true });
});

export default impulseRouter;
