import { connect, StringCodec } from 'nats';

const servers = process.env.NATS_URL?.split(/[,\s]+/g).filter(Boolean) ?? ['nats://localhost:4222'];
const subject = process.env.COSMIC_SUBJECT ?? 'demo.cosmic.tick';
const queue = process.env.COSMIC_QUEUE;
const sc = StringCodec();
let draining = false;

function decodePayload(data) {
  try {
    const decoded = sc.decode(data);
    try {
      const parsed = JSON.parse(decoded);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return decoded;
    }
  } catch {
    return `<${data.length} bytes>`;
  }
}

async function main() {
  const nc = await connect({ servers });
  console.log(
    `listening on ${subject}${queue ? ` (queue: ${queue})` : ''} @ ${servers.join(', ')}`,
  );

  async function shutdown(signal) {
    if (draining) return;
    draining = true;
    console.log(`\n${signal} received – draining connection...`);
    try {
      await nc.drain();
      console.log('connection closed.');
    } catch (error) {
      console.error('drain failed:', error);
      await nc.close();
    } finally {
      process.exit(0);
    }
  }

  for (const sig of ['SIGINT', 'SIGTERM']) {
    process.once(sig, () => {
      void shutdown(sig);
    });
  }

  const subscription = nc.subscribe(subject, queue ? { queue } : undefined);

  for await (const message of subscription) {
    const payload = decodePayload(message.data);
    const info = [`[${message.subject}]`, message.headers?.get('crep-sample') ?? undefined]
      .filter(Boolean)
      .join(' ');
    console.log(info.length ? `${info}\n${payload}` : payload);
  }
}

main().catch((error) => {
  console.error('❌ cosmic subscriber failed:', error);
  process.exitCode = 1;
});
