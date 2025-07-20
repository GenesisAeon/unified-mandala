import express from 'express';

export function createModule5() {
  const app = express();
  app.get('/ping', (_req, res) => res.json({ module: 'module5' }));
  return app;
}
