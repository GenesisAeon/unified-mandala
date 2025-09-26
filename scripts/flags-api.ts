import express from 'express';
import { FeatureFlags } from '../packages/featureflags/FeatureFlags';

async function main() {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  const ff = new FeatureFlags({
    servers: process.env.NATS_URL || 'nats://localhost:4222',
    bucket: process.env.NATS_FEATURE_FLAGS_BUCKET || 'featureflags',
  });
  await ff.connect();

  app.get('/flags/:name', async (req, res) => {
    const enabled = await ff.get(req.params.name);
    if (enabled === null) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json({ name: req.params.name, enabled });
  });

  app.put('/flags/:name', async (req, res) => {
    const { enabled } = req.body;
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'enabled boolean required' });
    }
    await ff.set(req.params.name, enabled);
    res.json({ status: 'ok' });
  });

  app.delete('/flags/:name', async (req, res) => {
    await ff.delete(req.params.name);
    res.json({ status: 'deleted' });
  });

  const rawPort = process.env.FLAGS_API_PORT ?? process.env.PORT ?? '3004';
  const parsed = Number.parseInt(rawPort, 10);
  const port = Number.isNaN(parsed) ? 3004 : parsed;
  app.listen(port, () => {
    console.log(`Flags API server listening on ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
