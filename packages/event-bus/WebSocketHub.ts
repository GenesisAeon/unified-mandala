import WebSocket, { WebSocketServer } from 'ws';
import { LocalEventBus } from './LocalEventBus';
import { Subjects } from './subjects';

/**
 * WebSocketHub broadcasts LocalEventBus events to connected WebSocket clients
 * and can optionally accept messages from clients to publish back into the
 * LocalEventBus.
 */
export class WebSocketHub {
  private wss: WebSocketServer;
  private cleanups: Array<() => void> = [];

  constructor(
    port: number,
    private bus: LocalEventBus,
    subjects: Subjects[] = Object.values(Subjects),
  ) {
    this.wss = new WebSocketServer({ port });

    // Forward messages from clients into the event bus
    this.wss.on('connection', (ws) => {
      ws.on('message', (raw) => {
        try {
          const msg = JSON.parse(raw.toString());
          if (msg && msg.subject && subjects.includes(msg.subject)) {
            this.bus.publish(msg.subject as Subjects, msg.data);
          }
        } catch {
          // Ignore malformed messages
        }
      });
    });

    // Broadcast bus events to all connected clients
    for (const subject of subjects) {
      const off = this.bus.subscribe(subject, (data) => {
        const payload = JSON.stringify({ subject, data });
        for (const client of this.wss.clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        }
      });
      this.cleanups.push(off);
    }
  }

  /** Close the hub and unsubscribe from all subjects. */
  close(): void {
    for (const off of this.cleanups) {
      off();
    }
    this.wss.close();
  }
}
