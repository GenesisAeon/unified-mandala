import { logger } from './logger';

describe('logger', () => {
  it('defaults to info level', () => {
    expect(logger.level).toBe('info');
  });
});
