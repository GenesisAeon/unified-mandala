import express from 'express';
import { redactImage, RedactionRegion } from '../packages/redaction/ImageRedactor';
import Tesseract from 'tesseract.js';

const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/redact', async (req, res) => {
  const { image, regions, ocr } = req.body;
  if (!image || !Array.isArray(regions)) {
    return res.status(400).json({ error: 'image and regions required' });
  }
  try {
    const buffer = Buffer.from(image, 'base64');
    const redacted = await redactImage(buffer, regions as RedactionRegion[]);
    let text: string | undefined;
    if (ocr) {
      const result = await Tesseract.recognize(redacted, 'eng');
      text = result.data.text;
    }
    res.json({ image: redacted.toString('base64'), text });
  } catch (err) {
    console.error('redaction failed', err);
    res.status(500).json({ error: 'redaction failed' });
  }
});

const port = parseInt(process.env.PORT || '4000', 10);
app.listen(port, () => {
  console.log(`Redaction API listening on ${port}`);
});

export default app;
