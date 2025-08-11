import express from 'express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const configFile = path.resolve(__dirname, '../config/onboarding/services.yaml');
const userDir = path.resolve(__dirname, '../user-config');
const selectedFile = path.join(userDir, 'services_selected.yaml');

let services: { id: string; name: string; type: string; description?: string }[] = [];
try {
  const raw = fs.readFileSync(configFile, 'utf8');
  const parsed = yaml.load(raw) as { services: typeof services };
  services = parsed?.services || [];
} catch {
  // ignore missing config
}

const router = express.Router();

router.get('/api/services', (_req, res) => {
  res.json({ services });
});

router.post('/api/services', (req, res) => {
  const { selected } = req.body || {};
  if (!Array.isArray(selected)) {
    return res.status(400).json({ error: 'selected required' });
  }
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  fs.writeFileSync(selectedFile, yaml.dump({ selected }), 'utf8');
  res.json({ ok: true });
});

export default router;
