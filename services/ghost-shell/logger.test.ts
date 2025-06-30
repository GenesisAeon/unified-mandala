import { logger } from './logger';

describe('logger', () => {
  it('creates a pino logger', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });
});
