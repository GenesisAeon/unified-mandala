import express from 'express';

const router = express.Router();

router.post('/code', async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt required' });
  try {
    // placeholder for Claude API call
    res.json({ result: `claude:${prompt}` });
  } catch (err) {
    res.status(500).json({ error: 'claude request failed' });
  }
});

export default router;
