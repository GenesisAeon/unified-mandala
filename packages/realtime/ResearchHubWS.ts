import { WebSocketServer, WebSocket } from 'ws';
import { LocalEventBus, Subjects } from '../event-bus';
import { wrap, LiveMsg } from './StreamProtocol';

export interface ResearchHubWSOptions {
  port: number;
  bus: LocalEventBus;
}

/**
 * ResearchHubWS bridges LocalEventBus events to WebSocket clients.
 * Clients can subscribe/unsubscribe to Subjects using the StreamProtocol
 * message shapes. Published bus events are forwarded to all subscribers.
 */
export class ResearchHubWS {
  private wss: WebSocketServer;
  private subs = new Map<WebSocket, Set<Subjects>>();
  private busSubs = new Map<Subjects, () => void>();

  constructor(private options: ResearchHubWSOptions) {
    this.wss = new WebSocketServer({ port: options.port });
    this.wss.on('connection', (ws) => {
      this.subs.set(ws, new Set());
      ws.on('message', (data) => this.handleMessage(ws, data.toString()));
      ws.on('close', () => this.cleanup(ws));
    });
  }

  private handleMessage(ws: WebSocket, raw: string) {
    let env: { msg: LiveMsg };
    try {
      env = JSON.parse(raw);
    } catch {
      return;
    }
    const msg = env.msg;
    switch (msg.type) {
      case 'ping':
        ws.send(JSON.stringify(wrap({ type: 'pong', ts: Date.now() })));
        break;
      case 'subscribe':
        this.addSubscription(ws, msg.channel as Subjects);
        break;
      case 'unsubscribe':
        this.removeSubscription(ws, msg.channel as Subjects);
        break;
    }
  }

  private addSubscription(ws: WebSocket, subject: Subjects) {
    const current = this.subs.get(ws);
    if (!current) return;
    if (current.has(subject)) return;
    current.add(subject);
    if (!this.busSubs.has(subject)) {
      const unsub = this.options.bus.subscribe(subject, (payload) => {
        this.broadcast(subject, payload);
      });
      this.busSubs.set(subject, unsub);
    }
  }

  private removeSubscription(ws: WebSocket, subject: Subjects) {
    const current = this.subs.get(ws);
    if (!current) return;
    current.delete(subject);
    if ([...this.subs.values()].every((s) => !s.has(subject))) {
      const unsub = this.busSubs.get(subject);
      unsub && unsub();
      this.busSubs.delete(subject);
    }
  }

  private broadcast(subject: Subjects, payload: unknown) {
    const message = JSON.stringify(wrap({ type: 'event', channel: subject, payload }));
    for (const [ws, set] of this.subs.entries()) {
      if (set.has(subject) && ws.readyState === ws.OPEN) {
        ws.send(message);
      }
    }
  }

  private cleanup(ws: WebSocket) {
    const set = this.subs.get(ws);
    if (!set) return;
    set.forEach((subject) => this.removeSubscription(ws, subject));
    this.subs.delete(ws);
  }

  close() {
    this.wss.close();
    this.busSubs.forEach((unsub) => unsub());
    this.busSubs.clear();
    this.subs.clear();
  }

  address() {
    return this.wss.address();
  }
}
