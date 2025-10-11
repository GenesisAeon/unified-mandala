import express from 'express';

const app = express();
app.use(express.json());

// Stub endpoint for speech-to-text requests
app.post('/stt', (_req, res) => {
  res.json({ transcript: null });
});

// Stub endpoint for screen capture requests
app.get('/screencap', (_req, res) => {
  res.json({ image: null });
});

// Stub endpoint for hotkey actions
app.post('/hotkey', (req, res) => {
  res.json({ received: req.body });
});

const port = parseInt(process.env.PORT || '5050', 10);
app.listen(port, () => {
  console.log(`Voice OS Control API listening on ${port}`);
});

export default app;
