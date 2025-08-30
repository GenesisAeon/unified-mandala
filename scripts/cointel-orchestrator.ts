import express from 'express';

interface Task {
  id: string;
  target: 'human' | 'ai';
  payload: unknown;
  url?: string;
}

const HUMAN_ENDPOINT = process.env.HUMAN_ENDPOINT || 'http://localhost:3001/tasks';
const AI_ENDPOINT = process.env.AI_ENDPOINT || 'http://localhost:3002/tasks';

async function dispatch(task: Task): Promise<boolean> {
  const endpoint = task.url || (task.target === 'human' ? HUMAN_ENDPOINT : AI_ENDPOINT);
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: task.id, payload: task.payload }),
  });
  return resp.ok;
}

const app = express();
app.use(express.json());

app.post('/task', async (req, res) => {
  const task: Task = req.body;
  try {
    const ok = await dispatch(task);
    res.json({ ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const port = Number(process.env.PORT) || 7000;
app.listen(port, () => {
  console.log(`CoIntel orchestrator listening on port ${port}`);
});
