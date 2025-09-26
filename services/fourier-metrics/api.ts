import express from 'express';
import { FourierLayer } from '../../packages/analysis/FourierLayer';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/fourier/analyze', (req, res) => {
    const data: number[] = req.body.data;
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'data must be array of numbers' });
    }
    const layer = new FourierLayer('api', 1, data, { depth: 1 });
    const { metrics, amplitudes } = layer.analyze();
    res.json({ metrics, amplitudes });
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = process.env.PORT ? Number(process.env.PORT) : 4200;
  app.listen(port, () => {
    console.log(`Fourier API listening on ${port}`);
  });
}
