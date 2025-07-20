import express from 'express';

export function createModule8() {
  const app = express();
  app.get('/ping', (_req, res) => res.json({ module: 'module8' }));
  return app;
}
