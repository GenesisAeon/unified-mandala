// @ts-nocheck
import { Kafka } from 'kafkajs';
import { createClient, RedisClientType } from 'redis';

export class EventBus {
  private kafka: Kafka;
  private redis: RedisClientType;
  constructor(private brokers: string[], private redisUrl: string) {
    this.kafka = new Kafka({ brokers });
    this.redis = createClient({ url: redisUrl });
  }

  async connect() {
    await this.redis.connect();
  }

  async publish(topic: string, message: object) {
    const producer = this.kafka.producer();
    await producer.connect();
    await producer.send({ topic, messages: [{ value: JSON.stringify(message) }] });
    await producer.disconnect();
  }

  async subscribe(topic: string, handler: (msg: any) => void) {
    const consumer = this.kafka.consumer({ groupId: 'pantheon-orchestrator' });
    await consumer.connect();
    await consumer.subscribe({ topic });
    await consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) handler(JSON.parse(message.value.toString()));
      }
    });
  }

  async cache(key: string, value: any) {
    await this.redis.set(key, JSON.stringify(value));
  }

  async close() {
    await this.redis.disconnect();
  }
}
