import express, { type Request, type Response } from 'express';
import { fetch } from 'undici';

type VerdictColor = 'green' | 'yellow' | 'red';

interface EthicsResponseBody {
  ok?: boolean;
  verdict?: VerdictColor;
  reason?: string;
  neededEvidence?: string[];
}

const app = express();
app.use(express.json({ limit: '1mb' }));

const offset = Number.parseInt(process.env.PORT_OFFSET ?? '0', 10) || 0;
const defaultPort = 3111 + offset;
const configuredPort = Number.parseInt(process.env.VERIFY_PORT ?? '', 10);
const port = Number.isFinite(configuredPort) ? configuredPort + offset : defaultPort;
const host = process.env.VERIFY_HOST ?? '127.0.0.1';

const ethicsPort = Number.parseInt(process.env.ETHICS_PORT ?? '', 10);
const defaultEthicsPort = Number.isFinite(ethicsPort) ? ethicsPort + offset : 3110 + offset;
const ethicsBase = (process.env.VERIFY_ETHICS_URL ?? `http://127.0.0.1:${defaultEthicsPort}`).replace(/\/+$/, '');
const upstreamBase = (process.env.VERIFY_UPSTREAM_URL ?? `http://127.0.0.1:${4000 + offset}`).replace(/\/+$/, '');

function forwardPath(originalUrl: string): string {
  const stripped = originalUrl.replace(/^\/gate/, '') || '/';
  return stripped.startsWith('/') ? stripped : `/${stripped}`;
}

async function fetchJson<T>(url: string, body: unknown): Promise<T | null> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.warn('[verify-gate] request failed', url, error);
    return null;
  }
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'verify-gate', ts: new Date().toISOString() });
});

app.post('/gate/*', async (req: Request, res: Response) => {
  const ethicsUrl = `${ethicsBase}/ethics/check`;
  const verdictBody = await fetchJson<EthicsResponseBody>(ethicsUrl, {
    intent: req.originalUrl.replace(/^\/gate\//, ''),
    content: req.body,
    context: req.body?.context,
  });

  const verdict = verdictBody?.verdict ?? 'red';
  if (verdict !== 'green') {
    return res.status(428).json({
      ok: false,
      verdict,
      reason: verdictBody?.reason ?? 'verification_failed',
      neededEvidence: verdictBody?.neededEvidence ?? ['weitere Evidenz erforderlich'],
    });
  }

  const path = forwardPath(req.originalUrl);
  const targetUrl = `${upstreamBase}${path}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: { 'content-type': 'application/json' },
      body: req.body ? JSON.stringify(req.body) : undefined,
    });

    const responseText = await response.text();
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      res.status(response.status).type(contentType).send(responseText);
    } else {
      res.status(response.status).type(contentType || 'text/plain').send(responseText);
    }
  } catch (error) {
    console.error('[verify-gate] upstream call failed', targetUrl, error);
    res.status(502).json({ ok: false, error: 'upstream_failed', detail: String((error as Error).message ?? error) });
  }
});

app.listen(port, host, () => {
  console.log(`[verify-gate] listening on http://${host}:${port} (upstream ${upstreamBase})`);
});
