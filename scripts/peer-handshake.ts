import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

const HANDSHAKE_FILE = path.resolve(__dirname, '../data/peer-handshakes.jsonl');

app.post('/handshake', (req, res) => {
  const { peerId, attestation } = req.body || {};
  if (!peerId || !attestation) {
    res.status(400).json({ error: 'peerId and attestation required' });
    return;
  }
  const entry = { peerId, attestation, received: new Date().toISOString() };
  fs.mkdirSync(path.dirname(HANDSHAKE_FILE), { recursive: true });
  fs.appendFileSync(HANDSHAKE_FILE, JSON.stringify(entry) + '\n');
  res.json({ status: 'ok' });
});

const port = Number(process.env.PORT) || 3040;
app.listen(port, () => {
  console.log(`Peer handshake service listening on ${port}`);
});
