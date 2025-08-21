import { LocalEventBus, NatsEventBus, Subjects, bridgeEventBuses } from '../packages/event-bus';

async function main() {
  const url = process.env.NATS_URL;
  const creds = process.env.NATS_CREDS;
  const maxReconnects = process.env.NATS_MAX_RECONNECTS ? parseInt(process.env.NATS_MAX_RECONNECTS, 10) : undefined;

  const local = new LocalEventBus();
  const nats = new NatsEventBus();
  await nats.connect({ url, creds, maxReconnects });

  const close = bridgeEventBuses(local, nats, Object.values(Subjects));
  console.log('Bus bridge running');

  process.on('SIGINT', async () => {
    console.log('Closing bus bridge');
    close();
    await nats.close();
    process.exit(0);
  });
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
