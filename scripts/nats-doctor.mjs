#!/usr/bin/env node
import { connect } from 'nats';

const url = process.env.NATS_URL ?? 'nats://127.0.0.1:4222';
const attempts = Number.parseInt(process.env.NATS_DOCTOR_ATTEMPTS ?? '5', 10);
const delayMs = Number.parseInt(process.env.NATS_DOCTOR_DELAY_MS ?? '500', 10);
const timeout = Number.parseInt(process.env.NATS_DOCTOR_TIMEOUT ?? '2000', 10);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formatError = (error) => {
  if (!error) return 'unknown error';
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

const run = async () => {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const nc = await connect({ servers: url, timeout });
      const jsm = await nc.jetstreamManager();
      await jsm.info();
      console.log(`✓ NATS JetStream ready at ${url} (attempt ${attempt}/${attempts})`);
      await nc.close();
      return 0;
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed: ${formatError(error)}`);
      if (attempt < attempts) {
        await sleep(delayMs);
      }
    }
  }

  console.error(`⛔ NATS JetStream not ready at ${url}: ${formatError(lastError)}`);
  return 1;
};

run()
  .then((code) => {
    process.exit(code);
  })
  .catch((error) => {
    console.error('⛔ NATS JetStream doctor encountered an unexpected error:', formatError(error));
    process.exit(1);
  });
