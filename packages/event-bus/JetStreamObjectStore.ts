import {
  connect,
  StringCodec,
  type ConnectionOptions,
  type JetStreamClient,
  type NatsConnection,
  type ObjectStore,
} from 'nats';

export interface JetStreamObjectStoreOptions extends ConnectionOptions {
  bucket: string;
}

/**
 * Simple wrapper for NATS JetStream object store.
 */
export class JetStreamObjectStore {
  private nc?: NatsConnection;
  private js?: JetStreamClient;
  private os?: ObjectStore;
  private sc = StringCodec();

  constructor(private opts: JetStreamObjectStoreOptions) {}

  async connect() {
    const { bucket, ...conn } = this.opts;
    this.nc = await connect(conn);
    this.js = this.nc.jetstream();
    this.os = await this.js.views.os(bucket);
  }

  private ensure() {
    if (!this.os) throw new Error('Not connected');
  }

  async put(name: string, data: Uint8Array | string) {
    this.ensure();
    const payload = typeof data === 'string' ? this.sc.encode(data) : data;
    await this.os!.put({ name }, payload as any);
  }

  async get(name: string): Promise<Uint8Array | null> {
    this.ensure();
    try {
      const obj = await this.os!.get(name);
      if (!obj) return null;
      const chunks: Uint8Array[] = [];
      for await (const chunk of obj.data) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch {
      return null;
    }
  }

  async delete(name: string) {
    this.ensure();
    await this.os!.delete(name);
  }

  async close() {
    await this.nc?.close();
  }
}
