import express from 'express';

export function createModule4() {
  const app = express();
  app.get('/ping', (_req, res) => res.json({ module: 'module4' }));
  return app;
}
