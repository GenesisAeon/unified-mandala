#!/usr/bin/env -S node --experimental-fetch
import express from 'express';
import ports from '../config/ports';

type Target = { name: string; url: string };

const defaultTargets: Target[] = [
  { name: 'api', url: `http://localhost:${ports.ai}/health` },
  { name: 'experiments', url: `http://localhost:${ports.experiments}/health` },
  { name: 'share', url: `http://localhost:${ports.share}/health` },
  { name: 'rag', url: `http://localhost:${ports.rag}/health` },
  { name: 'flags', url: `http://localhost:${ports.flags}/health` },
  // { name: 'realtime', url: `http://localhost:${ports.realtime}/health` },
];

const app = express();

app.get('/health', async (_req, res) => {
  const extra = (process.env.HEALTH_TARGETS_EXTRA || '').split(/,\s*/).filter(Boolean);
  const extraTargets: Target[] = extra.map((url, i) => ({ name: `extra:${i + 1}`, url }));
  const targets: Target[] = [...defaultTargets, ...extraTargets];
  const results = await Promise.all(
    targets.map(async (t) => {
      try {
        const r = await fetch(t.url, { method: 'GET' });
        return { name: t.name, url: t.url, status: r.ok ? 'ok' : `http ${r.status}` };
      } catch {
        return { name: t.name, url: t.url, status: 'down' as const };
      }
    }),
  );
  const overall = results.every((r) => r.status === 'ok') ? 'ok' : 'degraded';
  res.json({ overall, services: results, ts: new Date().toISOString() });
});

const PORT = ports.health;
app.listen(PORT, () => {
  console.log(`health-aggregator listening on http://localhost:${PORT}/health`);
});
