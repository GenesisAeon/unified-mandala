import { JetStreamKV, type JetStreamKVOptions } from '../event-bus';

export interface FeatureFlagsOptions extends JetStreamKVOptions {}

/**
 * Simple feature flag service backed by NATS JetStream KV buckets.
 */
export class FeatureFlags {
  private kv: JetStreamKV;

  constructor(opts: FeatureFlagsOptions) {
    this.kv = new JetStreamKV(opts);
  }

  async connect() {
    await this.kv.connect();
  }

  async set(name: string, enabled: boolean) {
    await this.kv.put(name, { enabled });
  }

  async get(name: string): Promise<boolean | null> {
    const data = await this.kv.get<{ enabled: boolean }>(name);
    return data ? data.enabled : null;
  }

  async delete(name: string) {
    await this.kv.delete(name);
  }

  async close() {
    await this.kv.close();
  }
}
