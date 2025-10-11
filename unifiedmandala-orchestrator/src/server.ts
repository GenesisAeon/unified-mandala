import express from 'express';
import fs from 'fs';
import yaml from 'yaml';

const app = express();
app.use(express.json());

const cfg = yaml.parse(
  fs.readFileSync('unifiedmandala-orchestrator/orchestrator/pipeline.config.local.yaml', 'utf8'),
);

app.post('/api/chat', (req, res) => {
  const { input, service } = req.body || {};
  const pick = service || 'gpt4all_chat';
  res.json({ service: pick, output: `🌀[${pick}] ${input}`, crep: 0.66 });
});

app.listen(7070, () => console.log('Orchestrator stub on :7070'));
