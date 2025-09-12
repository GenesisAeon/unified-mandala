import express from 'express';

const router = express.Router();

router.post('/code', async (req, res) => {
  const { snippet } = req.body || {};
  if (!snippet) return res.status(400).json({ error: 'snippet required' });
  const base = process.env.MISTRAL_API_BASE || 'https://api.mistral.ai/v1';
  const key = process.env.MISTRAL_API_KEY;
  try {
    const resp = await fetch(`${base}/code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(key ? { Authorization: `Bearer ${key}` } : {})
      },
      body: JSON.stringify({ snippet })
    });
    const data = await (resp as any).json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'mistral request failed' });
  }
});

export default router;
