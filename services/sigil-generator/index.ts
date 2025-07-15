import express from 'express';
import { generateMarkdownSigil } from './LangChainAdapter';

export function startServer(port = 4200) {
  const app = express();
  app.use(express.json());

  app.post('/sigil/generate', async (req, res) => {
    const { prompt } = req.body;
    const markdown = await generateMarkdownSigil(prompt || '');
    res.json({ markdown });
  });

  const server = app.listen(port, () => {
    console.log(`sigil-generator listening on ${port}`);
  });

  return { app, server };
}

if (require.main === module) {
  startServer();
}
