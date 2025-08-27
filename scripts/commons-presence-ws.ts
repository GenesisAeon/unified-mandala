import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { parse } from 'url';

const server = createServer();
const wss = new WebSocketServer({ noServer: true });

const rooms = new Map<string, Set<WebSocket>>();

function broadcast(room: string, message: any) {
  const clients = rooms.get(room);
  if (!clients) return;
  const data = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

wss.on('connection', (ws, req) => {
  const { query } = parse(req.url || '', true);
  const room = typeof query.spaceId === 'string' ? query.spaceId : undefined;
  if (!room) {
    ws.close();
    return;
  }
  let set = rooms.get(room);
  if (!set) {
    set = new Set();
    rooms.set(room, set);
  }
  set.add(ws);
  broadcast(room, { type: 'join' });

  ws.on('close', () => {
    set?.delete(ws);
    broadcast(room, { type: 'leave' });
  });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

const port = Number(process.env.PRESENCE_PORT) || 4050;
server.listen(port, () => {
  console.log(`Commons presence websocket listening on :${port}`);
});
