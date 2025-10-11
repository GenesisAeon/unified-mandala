import {
  connect,
  consumerOpts,
  type JetStreamClient,
  type JetStreamSubscription,
  type NatsConnection,
  StringCodec,
  type ConnectionOptions,
} from 'nats';
import { Subjects } from './subjects';

export interface JetStreamBusOptions {
  url?: string;
  creds?: string;
  maxReconnects?: number;
  durable?: string;
}

export class JetStreamBus {
  private nc?: NatsConnection;
  private js?: JetStreamClient;
  private sc = StringCodec();
  private durable: string;

  constructor(private opts: JetStreamBusOptions = {}) {
    this.durable = opts.durable || 'UM_WORKER';
  }

  async connect(): Promise<void> {
    const { url = 'nats://localhost:4222', creds, maxReconnects } = this.opts;
    const connectOpts: ConnectionOptions = { servers: url } as ConnectionOptions;
    if (creds) {
      (connectOpts as any).userCreds = creds;
    }
    if (typeof maxReconnects === 'number') {
      (connectOpts as any).maxReconnectAttempts = maxReconnects;
    }
    this.nc = await connect(connectOpts);
    this.js = this.nc.jetstream();
  }

  async publish(subject: Subjects, payload: unknown): Promise<void> {
    if (!this.js) throw new Error('Not connected');
    const data = this.sc.encode(JSON.stringify(payload));
    await this.js.publish(subject, data);
  }

  async subscribe(
    subject: Subjects,
    handler: (data: unknown) => void,
  ): Promise<JetStreamSubscription> {
    if (!this.js) throw new Error('Not connected');
    const opts = consumerOpts();
    opts.durable(this.durable);
    opts.manualAck();
    const sub = await this.js.subscribe(subject, opts);
    (async () => {
      for await (const msg of sub) {
        handler(JSON.parse(this.sc.decode(msg.data)));
        msg.ack();
      }
    })();
    return sub;
  }

  async close(): Promise<void> {
    await this.nc?.close();
  }
}
