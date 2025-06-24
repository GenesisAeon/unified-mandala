import express from 'express';
import healthz from '../packages/core/routes/healthz';
import metaScores from '../packages/core/routes/metaScores';

const app = express();
app.use(healthz);
app.use(metaScores);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Dev server listening on port ${port}`);
});
