import express from 'express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

interface ServiceConfig {
  endpoint: string;
  crep_threshold?: number;
}

interface ConfigFile {
  services: Record<string, ServiceConfig>;
}

const configPath = path.resolve(__dirname, '../config/agent-services.yaml');
let serviceConfig: ConfigFile = { services: {} };
try {
  const file = fs.readFileSync(configPath, 'utf8');
  serviceConfig = yaml.load(file) as ConfigFile;
} catch {
  // ignore, use empty config
}

const router = express.Router();

router.post('/api/chat', async (req, res) => {
  const { serviceId, message, externalUrl } = req.body || {};
  if (!message) return res.status(400).json({ error: 'message required' });

  const target = (serviceId && serviceConfig.services?.[serviceId]?.endpoint) || externalUrl;
  if (!target) return res.status(400).json({ error: 'serviceId or externalUrl required' });

  try {
    const resp = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await (resp as any).json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'chat proxy request failed' });
  }
});

export default router;
