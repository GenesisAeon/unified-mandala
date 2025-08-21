import { connect, type StreamConfig } from 'nats';

async function main() {
  const url = process.env.NATS_URL || 'nats://localhost:4222';
  const stream = process.env.NATS_STREAM || 'MANDALA';
  const subjects = (process.env.NATS_SUBJECTS || `${stream}.>`).split(',');
  const creds = process.env.NATS_CREDS;
  const maxReconnects = process.env.NATS_MAX_RECONNECTS ? parseInt(process.env.NATS_MAX_RECONNECTS, 10) : undefined;

  const connOpts: any = { servers: url, maxReconnectAttempts: maxReconnects };
  if (creds) {
    connOpts.userCreds = creds;
  }
  const nc = await connect(connOpts);
  const jsm = await nc.jetstreamManager();

  try {
    await jsm.streams.info(stream);
    console.log(`Stream ${stream} already exists`);
  } catch {
    const cfg: Partial<StreamConfig> = { name: stream, subjects };
    await jsm.streams.add(cfg);
    console.log(`Stream ${stream} created`);
  } finally {
    await nc.close();
  }
}

if (require.main === module) {
  main()
    .then(() => console.log('JetStream ready'))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
