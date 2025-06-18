import { connect, NatsConnection, StringCodec, Subscription } from 'nats';
import { Subjects } from './subjects';

export class NatsEventBus {
  private nc?: NatsConnection;
  private sc = StringCodec();

  async connect(url = 'nats://localhost:4222'): Promise<void> {
    this.nc = await connect({ servers: url });
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
