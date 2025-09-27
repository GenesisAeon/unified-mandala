import express from 'express';
import { FeatureFlags } from '../packages/featureflags/FeatureFlags';
import ports from '../config/ports';

async function main() {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  type FlagStore = {
    get(name: string): Promise<boolean | null>;
    set(name: string, enabled: boolean): Promise<void>;
    delete(name: string): Promise<void>;
  };

  let store: FlagStore;
  const ff = new FeatureFlags({
    servers: process.env.NATS_URL || 'nats://localhost:4222',
    bucket: process.env.NATS_FEATURE_FLAGS_BUCKET || 'featureflags',
  });
  const forceMemory =
    (process.env.FEATURE_FLAGS_MODE || '').toLowerCase() === 'memory' ||
    process.env.DISABLE_NATS === '1';
  if (forceMemory) {
    console.warn('[flags-api] Using in-memory feature flags (forced by env).');
    const memory = new Map<string, boolean>();
    store = {
      async get(name) {
        return memory.has(name) ? memory.get(name)! : null;
      },
      async set(name, enabled) {
        memory.set(name, enabled);
      },
      async delete(name) {
        memory.delete(name);
      },
    } satisfies FlagStore;
  } else {
    try {
      await ff.connect();
      store = ff as unknown as FlagStore;
    } catch (err: any) {
      console.warn(
        '[flags-api] NATS unavailable, using in-memory feature flags. Reason:',
        err?.message || err,
      );
      const memory = new Map<string, boolean>();
      store = {
        async get(name) {
          return memory.has(name) ? memory.get(name)! : null;
        },
        async set(name, enabled) {
          memory.set(name, enabled);
        },
        async delete(name) {
          memory.delete(name);
        },
      } satisfies FlagStore;
    }
  }

  app.get('/flags/:name', async (req, res) => {
    const enabled = await store.get(req.params.name);
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
    await store.set(req.params.name, enabled);
    res.json({ status: 'ok' });
  });

  app.delete('/flags/:name', async (req, res) => {
    await store.delete(req.params.name);
    res.json({ status: 'deleted' });
  });

  const port = ports.flags;
  app.listen(port, () => {
    console.log(`Flags API server listening on ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
