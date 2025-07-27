// @ts-nocheck
import { EventBus } from '../src/eventBus';
const mockRedis = { connect: jest.fn(), set: jest.fn(), disconnect: jest.fn() };
const mockProducer = { connect: jest.fn(), send: jest.fn(), disconnect: jest.fn() };
const mockKafka = { producer: jest.fn(() => mockProducer), consumer: jest.fn(() => ({ connect: jest.fn(), subscribe: jest.fn(), run: jest.fn() })) };

jest.mock('redis', () => ({ createClient: () => mockRedis }), { virtual: true });
jest.mock('kafkajs', () => ({ Kafka: jest.fn(() => mockKafka) }), { virtual: true });

const { createClient } = require('redis');
const { Kafka } = require('kafkajs');

describe('EventBus', () => {
  it('connects to redis', async () => {
    const bus = new EventBus(['localhost:9092'], 'redis://localhost');
    await bus.connect();
    expect(createClient().connect).toHaveBeenCalled();
  });

  it('publishes messages', async () => {
    const bus = new EventBus(['localhost:9092'], 'redis://localhost');
    await bus.publish('test', { a: 1 });
    const kafka = (Kafka as jest.Mock).mock.results[0].value;
    const producer = kafka.producer.mock.results[0].value;
    expect(producer.send).toHaveBeenCalled();
  });
});
