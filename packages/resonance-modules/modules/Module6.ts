import express from 'express';

export function createModule6() {
  const app = express();
  app.get('/ping', (_req, res) => res.json({ module: 'module6' }));
  return app;
}
