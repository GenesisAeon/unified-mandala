import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/code', async (req, res) => {
  const { snippet } = req.body || {};
  if (!snippet) return res.status(400).json({ error: 'snippet required' });
  try {
    const resp = await fetch('https://api.mistral.ai/v1/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ snippet })
    });
    const data = await (resp as any).json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'mistral request failed' });
  }
});

export default router;
