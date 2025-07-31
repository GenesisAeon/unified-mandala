import { describe, it, expect, vi } from 'vitest';
import { UnifiedLogger } from './UnifiedLogger';

describe('UnifiedLogger', () => {
  it('logs info messages with name prefix', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = new UnifiedLogger('Test');
    logger.info('hello');
    expect(spy).toHaveBeenCalledWith('[Test] hello');
    spy.mockRestore();
  });

  it('logs error messages with name prefix', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logger = new UnifiedLogger('Err');
    logger.error('fail');
    expect(spy).toHaveBeenCalledWith('[Err] fail');
    spy.mockRestore();
  });
});
