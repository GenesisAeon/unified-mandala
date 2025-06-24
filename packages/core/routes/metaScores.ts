import express from 'express';
const router = express.Router();

router.get('/api/meta-scores', (_req: any, res: any) => {
  res.json({ scores: [] });
});

export default router;
