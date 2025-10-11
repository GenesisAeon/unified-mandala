import { connect, NatsConnection, StringCodec, Subscription, ConnectionOptions } from 'nats';
import { Subjects } from './subjects';

export class NatsEventBus {
  private nc?: NatsConnection;
  private sc = StringCodec();

  async connect(
    options: { url?: string; creds?: string; maxReconnects?: number } = {},
  ): Promise<void> {
    const { url = 'nats://localhost:4222', creds, maxReconnects } = options;
    const connectOpts: ConnectionOptions = { servers: url } as ConnectionOptions;
    if (creds) {
      (connectOpts as any).userCreds = creds;
    }
    if (typeof maxReconnects === 'number') {
      (connectOpts as any).maxReconnectAttempts = maxReconnects;
    }
    this.nc = await connect(connectOpts);
  }

  async publish(subject: Subjects, payload: unknown): Promise<void> {
    if (!this.nc) throw new Error('Not connected');
    const data = this.sc.encode(JSON.stringify(payload));
    this.nc.publish(subject, data);
  }

  subscribe(subject: Subjects, handler: (data: unknown) => void): Subscription {
    if (!this.nc) throw new Error('Not connected');
    const sub = this.nc.subscribe(subject);
    (async () => {
      for await (const msg of sub) {
        handler(JSON.parse(this.sc.decode(msg.data)));
      }
    })();
    return sub;
  }

  async close(): Promise<void> {
    await this.nc?.close();
  }
}
