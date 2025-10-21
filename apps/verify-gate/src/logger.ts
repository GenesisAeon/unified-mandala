import pino from 'pino';

export const log = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'headers.authorization',
      'headers.cookie',
      'authorization',
      'cookie',
    ],
    remove: true,
  },
});
