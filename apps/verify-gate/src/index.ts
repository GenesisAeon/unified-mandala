import express from 'express';

const app = express();
app.use(express.json({ limit: '1mb' }));

const offset = Number.parseInt(process.env.PORT_OFFSET ?? '0', 10) || 0;
const host = process.env.VERIFY_HOST || '127.0.0.1';
const port = Number.parseInt(process.env.VERIFY_PORT ?? '', 10) || 3111 + offset;
const upstream = process.env.VERIFY_UPSTREAM_URL || `http://127.0.0.1:${4000 + offset}`;
const ethicsPort = Number.parseInt(process.env.ETHICS_PORT ?? '', 10) || 3110 + offset;
const ethicsHost = process.env.ETHICS_HOST || '127.0.0.1';

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'verify-gate', ts: new Date().toISOString() });
});

async function postJson(url: string, body: unknown) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = response.ok ? await response.json() : null;
    return { status: response.status, ok: response.ok, json: payload };
  } catch (error) {
    return { status: 500, ok: false, json: { error: String(error?.message ?? error) } };
  }
}

app.post('/gate/*', async (req, res) => {
  const check = await postJson(`http://${ethicsHost}:${ethicsPort}/ethics/check`, {
    intent: req.path.replace(/^\/gate\//, '/'),
    content: req.body?.content ?? req.body,
    context: req.body?.context,
  });

  const verdict = check.json?.verdict ?? 'red';
  if (!check.ok || verdict !== 'green') {
    return res.status(428).json({
      ok: false,
      verdict,
      reason: check.json?.reason ?? 'verification_failed',
      neededEvidence: check.json?.neededEvidence ?? [],
    });
  }

  const forwardPath = req.path.replace(/^\/gate\//, '/');
  try {
    const response = await fetch(`${upstream}${forwardPath}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const contentType = response.headers.get('content-type') || 'application/json';
    res.status(response.status).set('content-type', contentType);
    if (contentType.includes('application/json')) {
      res.send(await response.json());
    } else {
      res.send(await response.text());
    }
  } catch (error) {
    res.status(502).json({
      ok: false,
      verdict: 'error',
      reason: 'upstream_unreachable',
      detail: String(error?.message ?? error),
    });
  }
});

app.listen(port, host, () => {
  console.log(`verify-gate listening on http://${host}:${port} (ethics -> ${ethicsHost}:${ethicsPort}, upstream ${upstream})`);
});

