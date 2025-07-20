import express from 'express';

export function createModule7() {
  const app = express();
  app.get('/ping', (_req, res) => res.json({ module: 'module7' }));
  return app;
}
