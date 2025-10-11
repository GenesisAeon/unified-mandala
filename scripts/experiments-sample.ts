import { connect } from 'nats';
import { TextEncoder } from 'util';
import ExperimentRegistry, { ExperimentRecord } from '../packages/experiments/ExperimentRegistry';

async function main(): Promise<void> {
  let registry: ExperimentRegistry;
  try {
    const nc = await connect({ servers: process.env.NATS_URL ?? 'nats://localhost:4222' });
    registry = await ExperimentRegistry.connect(nc);
    const record: ExperimentRecord = {
      id: 'sample',
      metadata: { description: 'sample experiment' },
      artifact: new TextEncoder().encode('hello world'),
    };
    await registry.register(record);
    console.log('registered experiment', record.id);
    await nc.close();
  } catch (err) {
    // Fallback to in-memory registry when NATS is unavailable
    registry = new ExperimentRegistry();
    const record: ExperimentRecord = {
      id: 'sample',
      metadata: { description: 'sample experiment (memory)' },
    };
    await registry.register(record);
    console.log('registered experiment in memory', record.id);
  }
  console.log('current records', registry.list());
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
