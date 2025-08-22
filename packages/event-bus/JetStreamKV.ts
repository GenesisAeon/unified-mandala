import { connect, StringCodec, type ConnectionOptions, type JetStreamClient, type NatsConnection, type KV } from 'nats';

export interface JetStreamKVOptions extends ConnectionOptions {
  bucket: string;
}

/**
 * Wrapper around NATS JetStream key-value buckets.
 */
export class JetStreamKV {
  private nc?: NatsConnection;
  private js?: JetStreamClient;
  private kv?: KV;
  private sc = StringCodec();

  constructor(private opts: JetStreamKVOptions) {}

  async connect() {
    const { bucket, ...conn } = this.opts;
    this.nc = await connect(conn);
    this.js = this.nc.jetstream();
    this.kv = await this.js.views.kv(bucket);
  }

  private ensure() {
    if (!this.kv) throw new Error('Not connected');
  }

  async put(key: string, value: unknown) {
    this.ensure();
    await this.kv!.put(key, this.sc.encode(JSON.stringify(value)));
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    this.ensure();
    const entry = await this.kv!.get(key);
    return entry ? (JSON.parse(this.sc.decode(entry.value)) as T) : null;
  }

  async delete(key: string) {
    this.ensure();
    await this.kv!.delete(key);
  }

  async close() {
    await this.nc?.close();
  }
}
