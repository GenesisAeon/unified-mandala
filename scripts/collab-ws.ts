import { WebSocketServer, WebSocket } from 'ws';
import * as Automerge from 'automerge';

interface ChangeMessage {
  id: string;
  changes: Uint8Array[];
}

const docs = new Map<string, any>();

const port = Number(process.env.PORT ?? 8080);
const wss = new WebSocketServer({ port });

function getDoc(id: string): any {
  let doc = docs.get(id);
  if (!doc) {
    doc = Automerge.init();
    docs.set(id, doc);
  }
  return doc;
}

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (data) => {
    try {
      const msg: ChangeMessage = JSON.parse(data.toString());
      const doc = Automerge.applyChanges(getDoc(msg.id), msg.changes);
      docs.set(msg.id, doc);
      const broadcast = JSON.stringify(msg);
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(broadcast);
        }
      });
    } catch (err) {
      ws.send(JSON.stringify({ error: 'invalid message' }));
    }
  });

  ws.on('error', () => {
    /* ignore client errors */
  });
});

wss.on('listening', () => {
  console.log(`collab-ws listening on :${port}`);
});
