import { startFourierObservability } from './observability';

it('initializes OpenTelemetry SDK', async () => {
  const sdk = startFourierObservability('test');
  expect(sdk).toBeDefined();
  await sdk.shutdown();
});
