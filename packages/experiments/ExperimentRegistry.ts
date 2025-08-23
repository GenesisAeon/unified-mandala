import { JetStreamClient, NatsConnection, StringCodec } from "nats";

export interface ExperimentRecord {
  id: string;
  metadata: Record<string, unknown>;
  artifact?: Uint8Array;
}

/**
 * ExperimentRegistry stores experiment metadata and optional artifacts.
 * It keeps an in-memory list and can persist to a JetStream stream
 * when a NATS JetStream client is provided.
 */
export class ExperimentRegistry {
  private records = new Map<string, ExperimentRecord>();
  private sc = StringCodec();

  constructor(private js?: JetStreamClient) {}

  /**
   * Create a registry backed by JetStream. If the stream does not exist
   * it will be created with subject `experiments.*`.
   */
  static async connect(nc: NatsConnection): Promise<ExperimentRegistry> {
    const js = nc.jetstream();
    try {
      const jsm = await nc.jetstreamManager();
      await jsm.streams.add({ name: "experiments", subjects: ["experiments.*"] });
    } catch (err: any) {
      // ignore if already exists or manager unavailable
    }
    return new ExperimentRegistry(js);
  }

  /**
   * Register a new experiment record. The record is stored in memory and
   * optionally published to JetStream.
   */
  async register(record: ExperimentRecord): Promise<void> {
    this.records.set(record.id, record);
    if (this.js) {
      const payload = this.sc.encode(JSON.stringify(record));
      await this.js.publish(`experiments.${record.id}`, payload);
    }
  }

  /** Retrieve a stored record by id. */
  get(id: string): ExperimentRecord | undefined {
    return this.records.get(id);
  }

  /** List all stored experiment records. */
  list(): ExperimentRecord[] {
    return Array.from(this.records.values());
  }
}

export default ExperimentRegistry;
