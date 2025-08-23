import { FeatureFlags } from '../packages/featureflags/FeatureFlags';

async function main() {
  const ff = new FeatureFlags({
    servers: process.env.NATS_URL || 'nats://localhost:4222',
    bucket: process.env.NATS_FEATURE_FLAGS_BUCKET || 'featureflags'
  });
  await ff.connect();
  const defaults: Record<string, boolean> = {
    'researchHub.enabled': true
  };
  for (const [name, enabled] of Object.entries(defaults)) {
    await ff.set(name, enabled);
  }
  await ff.close();
  console.log('Seeded feature flags');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
