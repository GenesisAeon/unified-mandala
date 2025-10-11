import { defineConfig } from 'vite';
// Try to reuse base config if present
let base: any = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  base = require('./vite.config');
  base = base?.default ?? base;
} catch {}

export default defineConfig({
  ...(base || {}),
  server: {
    ...(base?.server || {}),
    proxy: {
      ...(base?.server?.proxy || {}),
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        configure(proxy: any) {
          proxy.on('proxyReq', (proxyReq: any) => {
            const key = process.env.LOCAL_API_KEY || 'dev-key';
            if (key) proxyReq.setHeader('X-API-Key', key);
          });
        },
      },
      // Forward /metrics as well (to support private metrics in dev)
      '/metrics': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        configure(proxy: any) {
          proxy.on('proxyReq', (proxyReq: any) => {
            const key = process.env.LOCAL_API_KEY || 'dev-key';
            if (key) proxyReq.setHeader('X-API-Key', key);
          });
        },
      },
    },
  },
});
