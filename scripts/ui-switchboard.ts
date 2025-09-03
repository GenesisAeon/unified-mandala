import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const registryUrl = process.env.INSTANCE_REGISTRY_URL;
const instancesDir = path.resolve(__dirname, '..', 'instances');

app.get('/instances', async (_req, res) => {
  try {
    if (registryUrl) {
      const resp = await fetch(`${registryUrl.replace(/\/$/, '')}/instances`);
      if (!resp.ok) {
        res.status(502).json({ error: `registry ${resp.status}` });
        return;
      }
      const data = await resp.json();
      res.json(data);
    } else {
      let instances: string[] = [];
      if (fs.existsSync(instancesDir)) {
        instances = fs
          .readdirSync(instancesDir, { withFileTypes: true })
          .filter((d) => d.isDirectory())
          .map((d) => d.name);
      }
      res.json({ instances });
    }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const port = Number(process.env.PORT) || 4020;
app.listen(port, () => {
  console.log(`UI Switchboard listening on :${port}`);
});
