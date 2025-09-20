import express from 'express';
import { SignedURL } from '../packages/security/SignedURL';

function resolvePort(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

async function main() {
  const app = express();
  app.use(express.json());

  const secret = process.env.SHARE_SECRET || 'change-me';
  const signer = new SignedURL(secret);

  app.post('/sign', (req, res) => {
    const { url, expiresIn } = req.body;
    if (typeof url !== 'string' || typeof expiresIn !== 'number') {
      return res.status(400).json({ error: 'url (string) and expiresIn (number) required' });
    }
    const signed = signer.sign(url, expiresIn);
    res.json({ url: signed });
  });

  app.get('/verify', (req, res) => {
    const url = req.query.url;
    if (typeof url !== 'string') {
      return res.status(400).json({ error: 'url query parameter required' });
    }
    const valid = signer.verify(url);
    res.json({ valid });
  });

  const sharePort = resolvePort(process.env.SHARE_API_PORT ?? process.env.PORT, 3000);
  app.listen(sharePort, () => {
    console.log(`Share API server listening on ${sharePort}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
