#!/usr/bin/env -S node --experimental-fetch
import express from 'express';

type Target = { name: string; url: string };

const defaultTargets: Target[] = [
  { name: 'api', url: 'http://localhost:4000/health' },
  { name: 'experiments', url: 'http://localhost:3002/health' },
  { name: 'share', url: 'http://localhost:3001/health' },
  { name: 'rag', url: 'http://localhost:3003/health' },
  { name: 'flags', url: 'http://localhost:3004/health' },
  // { name: 'realtime', url: 'http://localhost:4020/health' },
];

const app = express();

app.get('/health', async (_req, res) => {
  const targets = defaultTargets;
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

const PORT = Number(process.env.UM_HEALTH_PORT || 3999);
app.listen(PORT, () => {
  console.log(`health-aggregator listening on http://localhost:${PORT}/health`);
});
