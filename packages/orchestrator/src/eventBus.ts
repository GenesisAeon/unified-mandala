import { EventEmitter } from 'events';

export type EventBusBackend = 'memory' | 'kafka' | 'redis';

export interface EventBusOptions {
  backend?: EventBusBackend;
  kafkaBrokers?: string[];
  redisUrl?: string;
}

export class EventBus {
  private emitter = new EventEmitter();
  private kafkaProducer: any;
  private redisClient: any;

  constructor(private options: EventBusOptions = {}) {}

  async connect() {
    if (this.options.backend === 'kafka' && this.options.kafkaBrokers) {
      const { Kafka } = await import('kafkajs');
      const kafka = new Kafka({ brokers: this.options.kafkaBrokers });
      this.kafkaProducer = kafka.producer();
      await this.kafkaProducer.connect();
    } else if (this.options.backend === 'redis' && this.options.redisUrl) {
      const { createClient } = await import('redis');
      this.redisClient = createClient({ url: this.options.redisUrl });
      await this.redisClient.connect();
    }
  }

  async emit(channel: string, payload: any) {
    this.emitter.emit(channel, payload);
    if (this.kafkaProducer) await this.kafkaProducer.send({ topic: channel, messages: [{ value: JSON.stringify(payload) }] });
    if (this.redisClient) await this.redisClient.publish(channel, JSON.stringify(payload));
  }

  on(channel: string, handler: (payload: any) => void) {
    this.emitter.on(channel, handler);
    // Subscribers for kafka/redis would be implemented here in real setup
  }
}
