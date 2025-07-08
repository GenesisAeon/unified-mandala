import { initObservability } from './opentelemetry';

describe('initObservability', () => {
  it('initializes NodeSDK', () => {
    const sdk = initObservability('test');
    expect(sdk).toBeDefined();
    expect(typeof sdk.start).toBe('function');
    sdk.shutdown();
  });
});
