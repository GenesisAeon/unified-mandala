import express from 'express';
import path from 'path';
import fs from 'fs/promises';

export async function createServer() {
  const app = express();

  app.get('/metrics', async (_req, res) => {
    const file = path.join(__dirname, 'data', 'metrics.json');
    const data = await fs.readFile(file, 'utf8');
    res.json(JSON.parse(data));
  });

  app.get('/gamification', async (_req, res) => {
    const file = path.join(__dirname, 'data', 'gamification.json');
    const data = await fs.readFile(file, 'utf8');
    res.json(JSON.parse(data));
  });

  return app;
}

if (require.main === module) {
  createServer().then(app => {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`API server listening on ${port}`);
    });
  });
}
