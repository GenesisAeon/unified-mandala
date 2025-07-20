import express from 'express';

export function createModule9() {
  const app = express();
  app.get('/ping', (_req, res) => res.json({ module: 'module9' }));
  return app;
}
