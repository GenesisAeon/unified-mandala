#!/usr/bin/env node
import { connect, ErrorCode, isNatsError } from 'nats';

const targetUrl = process.env.NATS_URL || 'nats://127.0.0.1:4222';
const defaultStream = process.env.NATS_STREAM || 'MANDALA';
const featureFlagBucket = process.env.NATS_FEATURE_FLAGS_BUCKET || 'featureflags';

const HINT_LINES = [
  'Start NATS with JetStream enabled, for example:',
  '  docker run --name nats --restart unless-stopped \\',
  '    -p 4222:4222 -p 8222:8222 \\',
  '    -v nats-js:/data \\',
  '    -d nats:latest -js -sd /data',
  'Docs: docs/runbooks/nats-jetstream.md',
];

function logHint() {
  for (const line of HINT_LINES) {
    console.error(`[nats:doctor] ${line}`);
  }
}

function availabilityError(err) {
  if (!isNatsError(err)) return false;
  if (err.code === ErrorCode.Timeout) return true;
  if (err.code === ErrorCode.NoResponders || err.code === ErrorCode.JetStreamNotEnabled)
    return true;
  return typeof err.message === 'string' && /jetstream/i.test(err.message);
}

function describeError(err) {
  if (err instanceof Error) return err.message;
  return String(err);
}

async function main() {
  console.log(`[nats:doctor] Checking ${targetUrl} …`);

  let nc;
  try {
    nc = await connect({ servers: targetUrl, maxReconnectAttempts: 1 });
    console.log('[nats:doctor] Connected to NATS server.');
  } catch (error) {
    console.error(`[nats:doctor] Unable to connect: ${describeError(error)}`);
    logHint();
    process.exit(1);
  }

  try {
    const jsm = await nc.jetstreamManager({ timeout: 2000 });
    await jsm.getAccountInfo();
    console.log('[nats:doctor] JetStream API reachable.');

    try {
      const info = await jsm.streams.info(defaultStream);
      const subjectList = info.config?.subjects || [];
      const subjectSummary =
        subjectList.length > 0 ? subjectList.join(', ') : 'no subjects registered';
      console.log(`[nats:doctor] Stream "${defaultStream}" OK (${subjectSummary}).`);
    } catch (error) {
      if (
        availabilityError(error) ||
        (isNatsError(error) && error.code === ErrorCode.JetStream404NoMessages)
      ) {
        console.warn(
          `[nats:doctor] Stream "${defaultStream}" missing. Run "pnpm exec tsx scripts/js-setup.ts" to create it.`,
        );
      } else {
        console.warn(
          `[nats:doctor] Unable to inspect stream "${defaultStream}": ${describeError(error)}`,
        );
      }
    }

    const kvStream = `KV_${featureFlagBucket}`;
    try {
      await jsm.streams.info(kvStream);
      console.log(`[nats:doctor] Key-value bucket "${featureFlagBucket}" present (${kvStream}).`);
    } catch (error) {
      if (
        availabilityError(error) ||
        (isNatsError(error) && error.code === ErrorCode.JetStream404NoMessages)
      ) {
        console.warn(
          `[nats:doctor] Key-value bucket "${featureFlagBucket}" missing. Create it via "nats --server ${targetUrl} kv add ${featureFlagBucket}".`,
        );
      } else {
        console.warn(
          `[nats:doctor] Unable to inspect key-value bucket "${featureFlagBucket}": ${describeError(error)}`,
        );
      }
    }

    await nc?.close();
    console.log('[nats:doctor] Checks completed.');
  } catch (error) {
    console.error(`[nats:doctor] JetStream check failed: ${describeError(error)}`);
    if (availabilityError(error)) {
      logHint();
    }
    await nc?.close();
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`[nats:doctor] Unexpected error: ${describeError(error)}`);
  logHint();
  process.exit(1);
});
