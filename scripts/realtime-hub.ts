import express from 'express';
import { LocalEventBus, Subjects } from '../packages/event-bus';
import { ResearchHubWS } from '../packages/realtime';

const bus = new LocalEventBus();
const wsPort = Number(process.env.WS_PORT || 7070);
new ResearchHubWS({ port: wsPort, bus });

const app = express();
app.use(express.json());

app.get('/live/ask', (req, res) => {
  const question = (req.query.question as string) || '';

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  // flushHeaders is only present in some frameworks
  (res as any).flushHeaders?.();

  const unsub = bus.subscribe(Subjects.LIVE_ANSWER, (payload) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  });

  bus.publish(Subjects.LIVE_ASK, { question });

  // send placeholder answer if no other responder is active
  setTimeout(() => {
    bus.publish(Subjects.LIVE_ANSWER, { question, answer: 'acknowledged' });
  }, 0);

  req.on('close', () => {
    unsub();
    res.end();
  });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`realtime hub listening on http://localhost:${port} with ws ${wsPort}`);
});
