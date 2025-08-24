import express from 'express';
import { ReviewerQueue } from '../packages/hitloop';

const app = express();
app.use(express.json());

const queue = new ReviewerQueue();

app.post('/review/enqueue', (req, res) => {
  const id = queue.enqueue({ payload: req.body });
  res.json({ id });
});

app.post('/review/decision', (req, res) => {
  const { approve } = req.body as { approve: boolean };
  const item = queue.decide(() => approve);
  if (item) {
    res.json({ decision: approve ? 'approved' : 'rejected', item });
  } else {
    res.status(404).json({ error: 'no-item' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Reviewer API listening on ${port}`);
});
