import express from 'express';

export function createModule2() {
  const app = express();
  app.get('/ping', (_req, res) => res.json({ module: 'module2' }));
  return app;
}
