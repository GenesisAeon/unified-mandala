// Simple smoke test for guarded FS endpoints
// Usage: PROXY_URL=http://localhost:4000 LOCAL_API_KEY=... node scripts/smoke/fs-smoke.mjs

const base = process.env.PROXY_URL ?? 'http://localhost:4000';
const apiKey = process.env.LOCAL_API_KEY ?? process.env.API_KEY;

async function post(path, body) {
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(apiKey ? { 'X-API-Key': apiKey } : {}),
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${JSON.stringify(data).slice(0, 300)}`);
  }
  return data;
}

async function main() {
  const uri = 'scratch://smoke/hello.txt';
  const content = `Hallo Mandala @ ${new Date().toISOString()}`;
  console.log('[smoke:fs] write', uri);
  await post('/api/tools/fs/write', { uri, content, encoding: 'utf8' });
  console.log('[smoke:fs] read', uri);
  const r = await post('/api/tools/fs/read', { uri, encoding: 'utf8' });
  if (r?.content !== content) {
    throw new Error('content_mismatch');
  }
  console.log('[smoke:fs] ok');
}

main().catch((e) => {
  console.error('[smoke:fs] fail', e);
  process.exitCode = 1;
});
