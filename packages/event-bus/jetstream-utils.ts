import {
  ErrorCode,
  NatsError,
  type JetStreamClient,
  type JetStreamManager,
  type JetStreamOptions,
  type NatsConnection,
} from 'nats';

const JETSTREAM_HINT = [
  'Start NATS with JetStream enabled, for example:',
  '  docker run --name nats --restart unless-stopped \\',
  '    -p 4222:4222 -p 8222:8222 \\',
  '    -v nats-js:/data \\',
  '    -d nats:latest -js -sd /data',
].join('\n');

const JETSTREAM_DOC_REF = 'Docs: docs/runbooks/nats-jetstream.md';

function isJetStreamAvailabilityError(error: unknown): error is NatsError {
  if (!(error instanceof NatsError)) return false;
  if (error.code === ErrorCode.Timeout) return true;
  if (error.code === ErrorCode.NoResponders || error.code === ErrorCode.JetStreamNotEnabled) return true;
  return typeof error.message === 'string' && /jetstream/i.test(error.message);
}

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
}

function jetStreamUnavailable(context: string, error: unknown): Error {
  const details = toError(error).message;
  return new Error(
    `${context}: JetStream API is unavailable. ${JETSTREAM_HINT}\n${JETSTREAM_DOC_REF}\nOriginal error: ${details}`,
  );
}

export async function ensureJetStream(
  nc: NatsConnection,
  context = 'JetStream',
  options?: JetStreamOptions,
): Promise<{ js: JetStreamClient; jsm: JetStreamManager }> {
  try {
    const jsm = await nc.jetstreamManager(options);
    try {
      await jsm.getAccountInfo();
    } catch (error) {
      if (isJetStreamAvailabilityError(error)) {
        throw jetStreamUnavailable(context, error);
      }
      throw toError(error);
    }
    const js = nc.jetstream(options);
    return { js, jsm };
  } catch (error) {
    if (isJetStreamAvailabilityError(error)) {
      throw jetStreamUnavailable(context, error);
    }
    throw toError(error);
  }
}

export function jetStreamHelpMessage(): string {
  return `${JETSTREAM_HINT}\n${JETSTREAM_DOC_REF}`;
}

export { JETSTREAM_HINT, JETSTREAM_DOC_REF };
