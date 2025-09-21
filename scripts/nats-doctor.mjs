#!/usr/bin/env node
import { connect, StringCodec } from 'nats';

const url = process.env.NATS_URL ?? 'nats://127.0.0.1:4222';
const attempts = Number.parseInt(process.env.NATS_DOCTOR_ATTEMPTS ?? '5', 10);
const delayMs = Number.parseInt(process.env.NATS_DOCTOR_DELAY_MS ?? '500', 10);
const timeout = Number.parseInt(process.env.NATS_DOCTOR_TIMEOUT ?? '2000', 10);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const codec = StringCodec();
const hints = new Set();

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

const addHint = (hint) => {
  if (!hint) return;
  const trimmed = hint.trim();
  if (trimmed.length > 0) {
    hints.add(trimmed);
  }
};

const analyzeError = (error) => {
  if (!error) return;

  const message = formatError(error);
  const lower = message.toLowerCase();

  if (typeof error === 'object' && error !== null) {
    const code = 'code' in error && typeof error.code === 'string' ? error.code : undefined;
    if (code === '503') {
      addHint(
        'JetStream API responded with 503 – ensure the server was started with JetStream enabled (`nats-server -js` or Docker with `-js`).',
      );
    }
    if (code === 'TIMEOUT') {
      addHint(
        'JetStream request timed out – verify the container is running and reachable (port 4222, firewall/proxy exceptions).',
      );
    }
    if (code === 'CONNECTION_REFUSED' || code === 'ECONNREFUSED') {
      addHint(
        'Connection refused – confirm that a NATS server is running on the configured port and that `NATS_URL` points to it.',
      );
    }
  }

  if (lower.includes('jetstream not enabled')) {
    addHint(
      'JetStream not enabled – start the server with `-js` or enable JetStream in the NATS configuration.',
    );
  }
  if (lower.includes('no responders')) {
    addHint(
      '`$JS.API.INFO` had no responders – JetStream may be disabled or the account lacks JetStream permissions.',
    );
  }
  if (lower.includes('authorization') || lower.includes('permission')) {
    addHint(
      'Check NATS credentials – ensure the account can access JetStream subjects such as `$JS.API.INFO`.',
    );
  }
  if (lower.includes('timeout')) {
    addHint(
      'Request timeout – verify the Docker container is running, adjust `NATS_URL`, or inspect firewall/proxy rules.',
    );
  }
  if (lower.includes('connection refused') || lower.includes('econnrefused')) {
    addHint(
      'Connection refused – restart the JetStream container (`pnpm nats:docker restart`) or free the port with `pnpm dlx kill-port 4222`.',
    );
  }
};

const logHints = () => {
  if (hints.size === 0) return;
  console.error('Troubleshooting hints:');
  for (const hint of hints) {
    console.error(`  - ${hint}`);
  }
};

const run = async () => {
  let lastError;
  let lastServerInfo;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let nc;
    let ready = false;
    let attemptError;

    try {
      nc = await connect({ servers: url, timeout });
      const serverInfo = nc.info ?? {};
      lastServerInfo = serverInfo;
      const serverLabel = serverInfo.server_name ?? serverInfo.server_id;
      const jetstreamAdvertised = serverInfo.jetstream === true;

      if (!jetstreamAdvertised) {
        const labelText = serverLabel ? ` (${serverLabel})` : '';
        addHint(
          `Connected server${labelText} does not advertise JetStream support (info.jetstream !== true). Start it with \`-js\` or check the JetStream configuration.`,
        );
      }

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
        analyzeError(error);
      }

      let fallbackUsed = false;
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
            fallbackUsed = true;
          } else {
            attemptError = new Error(
              'JetStream info responded without account_info_response payload',
            );
            analyzeError(attemptError);
          }
        } catch (error) {
          attemptError = error;
          analyzeError(error);
        }
      }

      if (!ready && !jetstreamAdvertised && !attemptError) {
        attemptError = new Error(
          'Connected server does not advertise JetStream support (info.jetstream !== true).',
        );
        analyzeError(attemptError);
      }

      if (ready) {
        const labelSuffix = serverLabel ? ` [${serverLabel}]` : '';
        const fallbackSuffix = fallbackUsed ? ' via $JS.API.INFO fallback' : '';
        console.log(
          `✓ NATS JetStream ready at ${url}${labelSuffix} (attempt ${attempt}/${attempts})${fallbackSuffix}`,
        );
        return 0;
      }
    } catch (error) {
      attemptError = error;
      analyzeError(error);
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
    if (attemptError) {
      analyzeError(attemptError);
    }
    console.warn(`Attempt ${attempt} failed: ${formatError(attemptError)}`);
    if (attempt < attempts) {
      await sleep(delayMs);
    }
  }

  console.error(`⛔ NATS JetStream not ready at ${url}: ${formatError(lastError)}`);
  if (lastServerInfo && lastServerInfo.server_name) {
    console.error(`Last contacted server: ${lastServerInfo.server_name}`);
  }
  logHints();
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
