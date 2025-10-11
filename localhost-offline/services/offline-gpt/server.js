const express = require('express');
const app = express();
const responses = require('./model/responses.json');
app.use(express.json());

app.post('/chat', (req, res) => {
  const prompt = req.body.prompt;
  const answer = responses[prompt] || 'Ich kenne keine Antwort darauf.';
  res.json({ reply: answer });
});

app.listen(5000, () => console.log('Offline GPT Mock running'));
