import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { ensureDefaultMetrics } from '../src/metrics/singleton';

const app = express();
const PORT = Number(process.env.PORT || 3000);

// Prefer explicit env var; otherwise try common locations
const candidates = [
  process.env.UI_DIST,
  path.resolve('apps/ui/dist'),
  path.resolve('apps/mandala-ui/dist'),
  path.resolve('apps/web/dist'),
].filter(Boolean) as string[];

const pick = candidates.find((p) => {
  try {
    return fs.existsSync(path.join(p, 'index.html'));
  } catch {
    return false;
  }
});

const UI_DIST = pick || candidates[0];
if (!UI_DIST || !fs.existsSync(path.join(UI_DIST, 'index.html'))) {
  console.error('[dev-server] No index.html found.');
  console.error('Tried:', candidates.join(' | '));
  console.error('Fixes:');
  console.error('  1) Build UI:    pnpm -F mandala-ui build');
  console.error('  2) Or set env:  UI_DIST=apps/ui/dist pnpm dev');
  process.exit(1);
}

ensureDefaultMetrics();

app.use(express.static(UI_DIST, { index: 'index.html', fallthrough: true }));

// (Health kommt in PR-03 sauber via Paket; hier nur Basic)
app.get('/healthz', (_, res) => res.sendStatus(200));
app.get('/readyz', (_, res) => res.sendStatus(204));

// History-Fallback: alle unbekannten Routen auf index.html
app.use((req, res) => res.sendFile(path.join(UI_DIST, 'index.html')));

app.listen(PORT, () => {
  console.log(`[dev-server] :${PORT} → serving ${UI_DIST}`);
  console.log(`[dev-server] Deep links return index.html (History Fallback)`);
});
