import express from 'express';

export function createModule1() {
  const app = express();
  app.get('/ping', (_req, res) => res.json({ module: 'module1' }));
  return app;
}
