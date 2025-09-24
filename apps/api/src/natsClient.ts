import { connect, StringCodec, type NatsConnection } from 'nats';

const sc = StringCodec();
let connection: Promise<NatsConnection> | undefined;

async function getConnection() {
  if (!connection) {
    connection = connect({ servers: process.env.NATS_URL || 'localhost:4222' });
  }
  return connection;
}

export async function requestAI(payload: unknown, opts?: { timeout?: number; subject?: string }) {
  const subject = opts?.subject || process.env.NATS_SUBJECT || 'ai.request';
  const timeout = opts?.timeout ?? 10_000;
  const nc = await getConnection();

  const response = await nc.request(subject, sc.encode(JSON.stringify(payload)), { timeout });
  const data = JSON.parse(sc.decode(response.data));

  if (!data?.ok) {
    throw new Error(data?.error || 'AI worker rejected request');
  }

  return data.result;
}
