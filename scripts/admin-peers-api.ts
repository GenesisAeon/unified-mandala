import express from 'express';
import { AIPeer, AIPeerConnector } from '../packages/connectors/AIPeerConnector';

const app = express();
app.use(express.json());

const connector = new AIPeerConnector();

// simple bearer token check using ADMIN_TOKEN env var
function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = process.env.ADMIN_TOKEN;
  if (token && req.headers.authorization !== `Bearer ${token}`) {
    res.status(403).json({ error: 'forbidden' });
    return;
  }
  next();
}

app.use(auth);

app.post('/peers', (req, res) => {
  const peer = req.body as AIPeer;
  if (!peer || !peer.id || !peer.baseUrl) {
    res.status(400).json({ error: 'invalid peer' });
    return;
  }
  connector.register(peer);
  res.status(201).json({ status: 'registered' });
});

app.get('/peers', (_req, res) => {
  res.json({ peers: connector.list() });
});

app.delete('/peers/:id', (req, res) => {
  const ok = connector.unregister(req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'peer not found' });
    return;
  }
  res.json({ status: 'removed' });
});

app.all('/peers/:id/*', async (req, res) => {
  const { id } = req.params;
  const extra = (req.params as any)[0] as string | undefined;
  const path = extra ? `/${extra}` : '';
  try {
    const resp = await connector.invoke(id, path, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : JSON.stringify(req.body)
    });
    const text = await resp.text();
    res.status(resp.status).send(text);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const port = Number(process.env.PORT) || 4011;
app.listen(port, () => {
  console.log(`Admin peers API listening on :${port}`);
});
