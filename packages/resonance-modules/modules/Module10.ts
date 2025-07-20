import express from 'express';

export function createModule10() {
  const app = express();
  app.get('/ping', (_req, res) => res.json({ module: 'module10' }));
  return app;
}
