import express from 'express';

export function createModule3() {
  const app = express();
  app.get('/ping', (_req, res) => res.json({ module: 'module3' }));
  return app;
}
