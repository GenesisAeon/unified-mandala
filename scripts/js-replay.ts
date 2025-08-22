import { connect, consumerOpts, createInbox } from 'nats';

async function main() {
  const url = process.env.NATS_URL || 'nats://localhost:4222';
  const stream = process.env.NATS_STREAM || 'MANDALA';
  const subject = process.env.NATS_SUBJECT || `${stream}.>`;
  const durable = process.env.NATS_CONSUMER || 'replay';
  const max = process.env.NATS_MAX ? parseInt(process.env.NATS_MAX, 10) : undefined;

  const nc = await connect({ servers: url });
  const js = nc.jetstream();

  const opts = consumerOpts();
  opts.durable(durable);
  opts.deliverAll();
  opts.manualAck();
  opts.ackExplicit();
  opts.replayInstantly();
  opts.deliverTo(createInbox());

  const sub = await js.subscribe(subject, opts);
  let count = 0;
  for await (const m of sub) {
    const seq = m.seq;
    const data = m.data.toString();
    console.log(`[${seq}] ${m.subject}: ${data}`);
    m.ack();
    count++;
    if (max && count >= max) break;
  }
  await sub.destroy();
  await nc.close();
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
