import express from 'express';
import path from 'path';
import fs from 'fs/promises';

export async function createServer() {
  const app = express();

  const sendJson = async (res: express.Response, file: string) => {
    const data = await fs.readFile(file, 'utf8');
    res.json({ data: JSON.parse(data) });
  };

  app.get('/metrics', async (_req, res) => {
    const file = path.join(__dirname, 'data', 'metrics.json');
    await sendJson(res, file);
  });

  app.get('/gamification', async (_req, res) => {
    const file = path.join(__dirname, 'data', 'gamification.json');
    await sendJson(res, file);
  });

  app.get('/archive', async (_req, res) => {
    const file = path.join(__dirname, 'data', 'archive.json');
    await sendJson(res, file);
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
