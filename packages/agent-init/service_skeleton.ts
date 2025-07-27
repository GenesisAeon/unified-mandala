import express from 'express';

export function createService() {
  const app = express();
  app.get('/health', (_req, res) => res.send('ok'));
  return app;
}

if (require.main === module) {
  const app = createService();
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Service running on ${port}`));
}
