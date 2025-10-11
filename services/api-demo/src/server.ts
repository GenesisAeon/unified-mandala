import express from 'express';
import path from 'node:path';
import { buildHealthRouter } from '@um/health';

const app = express();
const PORT = Number(process.env.PORT || 3001);
const DIST = path.resolve('apps/mandala-ui/dist'); // falls nötig

// eigentliche Routen …
// app.get("/api/kpi/list", …)

app.use(
  buildHealthRouter({
    ready: () => true, // hier z.B. prüfen: DB verb., Cache warm etc.
  }),
);

app.listen(PORT, () => console.log(`[api-demo] on :${PORT}`));
