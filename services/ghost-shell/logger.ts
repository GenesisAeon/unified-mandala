import pino from 'pino';

export const logger = pino({
  level: 'info',
  ...(process.env.NODE_ENV !== 'test'
    ? { transport: { target: 'pino-pretty' } }
    : {}),
});
