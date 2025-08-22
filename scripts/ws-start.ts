import { LocalEventBus, Subjects, WebSocketHub } from '../packages/event-bus';

const port = parseInt(process.env.WS_PORT ?? '3001', 10);
const bus = new LocalEventBus();
const hub = new WebSocketHub(port, bus, Object.values(Subjects));

console.log(`WebSocketHub listening on port ${port}`);

process.on('SIGINT', () => {
  hub.close();
  bus.close();
  process.exit(0);
});
