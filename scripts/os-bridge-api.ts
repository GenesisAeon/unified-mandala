import express from 'express';
import { CapabilityGuard } from '../packages/os-bridge/CapabilityGuard';
import {
  getClipboard,
  setClipboard,
  captureScreen,
  runUIACommand,
} from '../packages/os-bridge/WindowsPS';

async function main() {
  const port = parseInt(process.env.PORT || '3030', 10);
  const app = express();
  app.use(express.json());

  const guard = new CapabilityGuard();

  app.post('/consent', (req, res) => {
    const { capability, granted } = req.body;
    if (typeof capability !== 'string' || typeof granted !== 'boolean') {
      return res.status(400).json({ error: 'capability and granted required' });
    }
    guard.request(capability, granted);
    res.json({ ok: true });
  });

  app.get('/clipboard', async (req, res) => {
    try {
      guard.enforce('clipboard.read');
      const text = await getClipboard();
      res.json({ text });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  app.post('/clipboard', async (req, res) => {
    const { text } = req.body;
    if (typeof text !== 'string') {
      return res.status(400).json({ error: 'text required' });
    }
    try {
      guard.enforce('clipboard.write');
      await setClipboard(text);
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  app.get('/screen', async (_req, res) => {
    try {
      guard.enforce('screen.capture');
      const image = await captureScreen();
      res.json({ image });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  app.post('/uia', async (req, res) => {
    const { command } = req.body;
    if (typeof command !== 'string') {
      return res.status(400).json({ error: 'command required' });
    }
    try {
      guard.enforce('uia.automation');
      await runUIACommand(command);
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  app.listen(port, () => {
    console.log(`OS Bridge API listening on ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
