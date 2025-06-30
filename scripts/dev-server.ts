import express from 'express';
import healthz from '../packages/core/routes/healthz';
import metaScores from '../packages/core/routes/metaScores';
import { metricsMiddleware, metricsEndpoint } from '../packages/core/middleware/metrics';

const app = express();
app.use(metricsMiddleware);
app.use(healthz);
app.use(metaScores);
app.get('/metrics', metricsEndpoint);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Dev server listening on port ${port}`);
});
