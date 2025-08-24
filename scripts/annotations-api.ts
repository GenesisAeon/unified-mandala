import express from 'express';
import path from 'path';
import { AnnotationsStore } from '../packages/collab/AnnotationsStore';
import { LocalEventBus, Subjects } from '../packages/event-bus';
import { ResearchHubWS } from '../packages/realtime';

async function main() {
  const storeDir = process.env.ANNOTATION_STORE_DIR || path.join('data', 'annotations');
  const port = parseInt(process.env.PORT || '3002', 10);
  const wsPort = parseInt(process.env.WS_PORT || '4022', 10);

  const bus = new LocalEventBus();
  new ResearchHubWS({ port: wsPort, bus });
  const store = new AnnotationsStore(storeDir);

  const app = express();
  app.use(express.json());

  app.get('/annotations/:docId', (req, res) => {
    const list = store.list(req.params.docId);
    res.json({ annotations: list });
  });

  app.post('/annotations/:docId', (req, res) => {
    const { text } = req.body;
    if (typeof text !== 'string') {
      return res.status(400).json({ error: 'text required' });
    }
    const ann = store.add(req.params.docId, text);
    bus.publish(Subjects.LIVE_ANSWER, { docId: req.params.docId, annotation: ann });
    res.json(ann);
  });

  app.listen(port, () => {
    console.log(`Annotations API server listening on ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

