import express from 'express';
import { connect } from 'nats';
import ExperimentRegistry, { ExperimentRecord } from '../packages/experiments/ExperimentRegistry';
import { enforcePolicy, PolicyOptions } from '../packages/personhood/PolicyGuard';
import { ConsentRegistry } from '../packages/personhood/ConsentRegistry';
import ports from '../config/ports';

function resolvePort(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

async function initRegistry(): Promise<ExperimentRegistry> {
  try {
    const nc = await connect({ servers: process.env.NATS_URL || 'nats://localhost:4222' });
    return await ExperimentRegistry.connect(nc);
  } catch {
    return new ExperimentRegistry();
  }
}

function verifyPersonhood(req: express.Request): void {
  const opts: PolicyOptions = {
    personId: req.header('x-person-id') || 'anon',
    region: req.header('x-region') || 'us',
    model: req.header('x-model') || 'gpt-4o',
    reviewed: req.header('x-reviewed') === 'true',
  };
  // Demo: automatically grant consent for provided person
  ConsentRegistry.grant(opts.personId);
  enforcePolicy(opts);
}

async function main() {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });
  const registry = await initRegistry();

  app.get('/experiments', (req, res) => {
    try {
      verifyPersonhood(req);
      res.json({ experiments: registry.list() });
    } catch (err: any) {
      res.status(403).json({ error: err.message });
    }
  });

  app.post('/experiments', async (req, res) => {
    try {
      verifyPersonhood(req);
      const { id, metadata, artifact } = req.body;
      if (!id || !metadata) {
        return res.status(400).json({ error: 'id and metadata required' });
      }
      const record: ExperimentRecord = {
        id,
        metadata,
        artifact: artifact ? Buffer.from(artifact, 'base64') : undefined,
      };
      await registry.register(record);
      res.json({ status: 'ok' });
    } catch (err: any) {
      res.status(403).json({ error: err.message });
    }
  });

  app.get('/experiments/:id', (req, res) => {
    try {
      verifyPersonhood(req);
      const record = registry.get(req.params.id);
      if (!record) {
        return res.status(404).json({ error: 'not found' });
      }
      res.json(record);
    } catch (err: any) {
      res.status(403).json({ error: err.message });
    }
  });

  app.get('/experiments/compare/:a/:b', (req, res) => {
    try {
      verifyPersonhood(req);
      const a = registry.get(req.params.a);
      const b = registry.get(req.params.b);
      if (!a || !b) {
        return res.status(404).json({ error: 'not found' });
      }
      res.json({ a, b });
    } catch (err: any) {
      res.status(403).json({ error: err.message });
    }
  });

  const experimentsPort = ports.experiments;
  app.listen(experimentsPort, () => {
    console.log(`Experiments API server listening on ${experimentsPort}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
