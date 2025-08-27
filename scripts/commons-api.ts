import express from 'express';

interface Space {
  id: string;
  name: string;
  members: Set<string>;
}

const app = express();
app.use(express.json());

const spaces = new Map<string, Space>();

app.post('/spaces', (req, res) => {
  const name = req.body?.name;
  if (typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ error: 'name required' });
    return;
  }
  const id = Math.random().toString(36).slice(2);
  const space: Space = { id, name, members: new Set() };
  spaces.set(id, space);
  res.json({ id, name });
});

app.post('/spaces/:id/invite', (req, res) => {
  const space = spaces.get(req.params.id);
  if (!space) {
    res.status(404).json({ error: 'space not found' });
    return;
  }
  const userId = req.body?.userId;
  if (typeof userId !== 'string' || !userId.trim()) {
    res.status(400).json({ error: 'userId required' });
    return;
  }
  space.members.add(userId);
  res.json({ id: space.id, members: Array.from(space.members) });
});

app.get('/spaces/:id/members', (req, res) => {
  const space = spaces.get(req.params.id);
  if (!space) {
    res.status(404).json({ error: 'space not found' });
    return;
  }
  res.json({ members: Array.from(space.members) });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Commons API listening on :${port}`);
});
