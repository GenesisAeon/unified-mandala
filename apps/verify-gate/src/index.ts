import { createApp } from './app.js';

const app = createApp();

const offset = Number.parseInt(process.env.PORT_OFFSET ?? '0', 10) || 0;
const defaultPort = 3111 + offset;
const configuredPort = Number.parseInt(process.env.VERIFY_PORT ?? '', 10);
const port = Number.isFinite(configuredPort) ? configuredPort + offset : defaultPort;
const host = process.env.VERIFY_HOST ?? '127.0.0.1';

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, host, () => {
    console.log(`[verify-gate] listening on http://${host}:${port}`);
  });
}

export { app, createApp };
