import express from 'express';

const app = express();
app.use(express.json());

const services = (process.env.ADMIN_SERVICES || '')
  .split(',')
  .map((s: string) => s.trim())
  .filter(Boolean);

app.get('/status', async (_req, res) => {
  const results = await Promise.all(
    services.map(async (url: string) => {
      try {
        const resp = await fetch(`${url}/health`);
        return { url, ok: resp.ok };
      } catch {
        return { url, ok: false };
      }
    })
  );
  res.json({ services: results });
});

app.all('/proxy/:service/*', async (req, res) => {
  const service = req.params.service;
  const base = services.find((s: string) => new URL(s).hostname === service || s.endsWith(service));
  if (!base) {
    res.status(404).json({ error: 'service not registered' });
    return;
  }
  const extraPath = (req.params as any)[0] as string | undefined;
  const targetPath = extraPath ? `/${extraPath}` : '';
  const targetUrl = `${base}${targetPath}`;
  const init: RequestInit = {
    method: req.method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = JSON.stringify(req.body);
  }
  try {
    const resp = await fetch(targetUrl, init);
    const text = await resp.text();
    res.status(resp.status).send(text);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const port = Number(process.env.PORT) || 4010;
app.listen(port, () => {
  console.log(`Admin API listening on :${port}`);
});

