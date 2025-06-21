// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
const router = express.Router();

router.get('/healthz', async (_req: any, res: any) => {
  // placeholder checks
  res.json({ ok: true });
});

export default router;
