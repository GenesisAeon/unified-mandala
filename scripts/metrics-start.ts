import express from 'express';
import { metricsEndpoint } from '../packages/core/middleware/metrics';

const app = express();
app.get('/metrics', metricsEndpoint);

const port = Number(process.env.METRICS_PORT) || 9108;
app.listen(port, () => {
  console.log(`Metrics server listening on port ${port}`);
});
