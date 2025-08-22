import express from 'express';
import { LocalEventBus, Subjects } from '../packages/event-bus';
import { ResearchHubWS } from '../packages/realtime';

const bus = new LocalEventBus();
const wsPort = Number(process.env.WS_PORT || 7070);
new ResearchHubWS({ port: wsPort, bus });

const app = express();
app.use(express.json());

app.post('/live/ask', (req, res) => {
  const question = (req.body && req.body.question) || '';
  bus.publish(Subjects.LIVE_ASK, { question });
  // Echo back a placeholder answer for now
  bus.publish(Subjects.LIVE_ANSWER, { question, answer: 'acknowledged' });
  res.json({ status: 'queued' });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`realtime hub listening on http://localhost:${port} with ws ${wsPort}`);
});
