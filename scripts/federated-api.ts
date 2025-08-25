import express, { Request, Response, NextFunction } from 'express';
import { SecureAggregator } from '../packages/federated';

const app = express();
app.use(express.json());

const epsilon = parseFloat(process.env.EPSILON || '0');
const aggregator = new SecureAggregator({ epsilon });

function requirePersonhood(req: Request, res: Response, next: NextFunction) {
  if (req.headers['x-personhood'] !== 'granted') {
    return res.status(403).json({ error: 'personhood required' });
  }
  next();
}

app.post('/update', requirePersonhood, (req: Request, res: Response) => {
  const { vector } = req.body;
  if (!Array.isArray(vector) || !vector.every((v: any) => typeof v === 'number')) {
    return res.status(400).json({ error: 'vector must be number[]' });
  }
  aggregator.addUpdate(vector);
  res.json({ ok: true });
});

app.get('/aggregate', requirePersonhood, (_req: Request, res: Response) => {
  const result = aggregator.aggregate();
  aggregator.clear();
  res.json({ vector: result });
});

const port = parseInt(process.env.PORT || '3003', 10);
app.listen(port, () => {
  console.log(`Federated API listening on ${port}`);
});
