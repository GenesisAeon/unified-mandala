#!/usr/bin/env node
import { connect, StringCodec } from 'nats';

const url = process.env.NATS_URL ?? 'nats://127.0.0.1:4222';
const attempts = Number.parseInt(process.env.NATS_DOCTOR_ATTEMPTS ?? '5', 10);
const delayMs = Number.parseInt(process.env.NATS_DOCTOR_DELAY_MS ?? '500', 10);
const timeout = Number.parseInt(process.env.NATS_DOCTOR_TIMEOUT ?? '2000', 10);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const codec = StringCodec();

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
    let nc;
    let ready = false;
    let attemptError;

    try {
      nc = await connect({ servers: url, timeout });

      try {
        if (typeof nc.jetstreamManager === 'function') {
          const manager = await nc.jetstreamManager();
          if (manager && typeof manager.info === 'function') {
            await manager.info();
            ready = true;
          }
        }
      } catch (error) {
        attemptError = error;
      }

      if (!ready) {
        try {
          const response = await nc.request('$JS.API.INFO', codec.encode(''), { timeout });
          const decoded = codec.decode(response.data);
          const payload = decoded ? JSON.parse(decoded) : {};
          if (
            payload &&
            typeof payload.type === 'string' &&
            payload.type.includes('account_info_response')
          ) {
            ready = true;
          } else {
            attemptError = new Error(
              'JetStream info responded without account_info_response payload',
            );
          }
        } catch (error) {
          attemptError = error;
        }
      }

      if (ready) {
        console.log(`✓ NATS JetStream ready at ${url} (attempt ${attempt}/${attempts})`);
        return 0;
      }
    } catch (error) {
      attemptError = error;
    } finally {
      if (nc) {
        try {
          await nc.drain();
        } catch (drainError) {
          try {
            await nc.close();
          } catch {
            // ignore secondary close errors
          }
          if (!attemptError) {
            attemptError = drainError;
          }
        }
      }
    }

    lastError = attemptError;
    console.warn(`Attempt ${attempt} failed: ${formatError(attemptError)}`);
    if (attempt < attempts) {
      await sleep(delayMs);
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
