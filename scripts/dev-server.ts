import express from 'express';
import healthz from '../packages/core/routes/healthz';
import metaScores from '../packages/core/routes/metaScores';
import { metricsMiddleware, metricsEndpoint } from '../packages/core/middleware/metrics';
import path from 'path';

const app = express();
app.use(metricsMiddleware);
app.use(healthz);
app.use(metaScores);
app.get('/metrics', metricsEndpoint);

const uiDist = path.resolve(__dirname, '../apps/ui/dist');
app.use(express.static(uiDist));
app.get('*', (_req, res) => res.sendFile(path.join(uiDist, 'index.html')));

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Dev server listening on port ${port}`);
});
