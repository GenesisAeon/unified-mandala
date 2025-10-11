import { BusTransport, EmitOptions } from './transport.js';
import { validateEvent, checkPersonhood } from './util.js';
import { connect, StringCodec, NatsConnection } from 'nats';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class NatsBus implements BusTransport {
  private nc!: NatsConnection;
  private sc = StringCodec();
  private prefix: string;

  constructor(prefix = 'mandala') {
    this.prefix = prefix;
  }

  async connect(url = process.env.NATS_SERVER_URL || 'nats://127.0.0.1:4222') {
    if (!this.nc) this.nc = await connect({ servers: url });
  }

  private subj(topic: string) {
    return `${this.prefix}.${topic}`;
  }

  async emit(topic: string, payload: any, options?: EmitOptions): Promise<void> {
    await this.connect();
    checkPersonhood(topic, options?.personhood);
    const evt = {
      id: uuid(),
      topic,
      actor: options?.actor || { id: 'system', role: 'agent' },
      ts: new Date().toISOString(),
      personhood: options?.personhood,
      payload,
    };
    validateEvent(evt);
    await this.nc.publish(this.subj(topic), this.sc.encode(JSON.stringify(evt)));
  }

  on(topic: string, handler: (evt: any) => void): void {
    this.connect().then(() => {
      const sub = this.nc.subscribe(this.subj(topic));
      (async () => {
        for await (const m of sub) {
          try {
            const evt = JSON.parse(this.sc.decode(m.data));
            handler(evt);
          } catch (e) {
            // ignore bad payloads
          }
        }
      })();
    });
  }
}
