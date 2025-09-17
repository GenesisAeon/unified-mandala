import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distIndex = path.resolve(__dirname, '../../apps/ui/dist/index.html');

if (!fs.existsSync(distIndex)) {
  console.error('[light-static-smoke] missing dist assets – run `pnpm build:ui` first');
  process.exit(1);
}

const requestedPort = process.env.START_LIGHT_PORT ?? '0';

const server = spawn('node', ['scripts/light-static-server.mjs'], {
  env: { ...process.env, PORT: requestedPort },
  stdio: ['ignore', 'pipe', 'inherit'],
});

let actualPort;
let serverClosed = false;

server.stdout.setEncoding('utf8');
server.stdout.on('data', (chunk) => {
  process.stdout.write(chunk);
  const match = chunk.match(/http:\/\/127\.0\.0\.1:(\d+)/u);
  if (match) {
    actualPort = Number.parseInt(match[1], 10);
  }
});

server.on('close', () => {
  serverClosed = true;
});

const waitForServer = async () => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (typeof actualPort === 'number' && !Number.isNaN(actualPort)) {
      return;
    }
    if (server.exitCode !== null) {
      throw new Error(`light-static-server exited early with code ${server.exitCode}`);
    }
    await sleep(100);
  }
  throw new Error('light-static-server did not report a listening port');
};

const getHeaderValue = (headers, name) => {
  const value = headers[name.toLowerCase()];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

const fetchRoot = (headers) =>
  new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: actualPort,
        path: '/',
        headers,
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode ?? 0,
            headers: res.headers,
            body: Buffer.concat(chunks),
          });
        });
      },
    );

    req.on('error', reject);
    req.end();
  });

const stopServer = async () => {
  if (serverClosed || server.killed) {
    return;
  }
  server.kill('SIGTERM');
  try {
    await once(server, 'close');
  } catch {
    // ignore close errors when shutting down intentionally
  }
};

let exitCode = 0;

try {
  await waitForServer();
  await sleep(150);

  const compressed = await fetchRoot({ 'accept-encoding': 'br, gzip' });
  if (compressed.statusCode !== 200) {
    throw new Error(`expected 200 response, received ${compressed.statusCode}`);
  }
  const encoding = getHeaderValue(compressed.headers, 'content-encoding');
  if (!encoding || !['br', 'gzip'].includes(encoding)) {
    throw new Error(`expected br/gzip encoding, received ${encoding ?? 'none'}`);
  }
  const vary = getHeaderValue(compressed.headers, 'vary') ?? '';
  if (!vary.toLowerCase().includes('accept-encoding')) {
    throw new Error('response is missing Vary: Accept-Encoding');
  }
  const cacheControl = getHeaderValue(compressed.headers, 'cache-control') ?? '';
  if (!cacheControl.includes('must-revalidate')) {
    throw new Error('cache-control for index.html must include must-revalidate');
  }
  if (compressed.body.length === 0) {
    throw new Error('compressed response body is empty');
  }

  const identity = await fetchRoot({ 'accept-encoding': 'identity' });
  if (identity.statusCode !== 200) {
    throw new Error(`identity request failed with status ${identity.statusCode}`);
  }
  const identityEncoding = getHeaderValue(identity.headers, 'content-encoding');
  if (identityEncoding && identityEncoding !== 'identity') {
    throw new Error(`unexpected content-encoding for identity request: ${identityEncoding}`);
  }
  const identityBody = identity.body.toString('utf8');
  if (!identityBody.toLowerCase().includes('<!doctype html')) {
    throw new Error('identity response does not look like HTML');
  }

  console.log('[light-static-smoke] HTTP checks passed');
} catch (error) {
  exitCode = 1;
  console.error('[light-static-smoke] smoke check failed:', error);
} finally {
  await stopServer();
  if (exitCode === 0 && server.exitCode && server.exitCode !== 0) {
    exitCode = server.exitCode;
  }
  process.exitCode = exitCode;
}
