import { callExternal } from './ExternalIntegrationAPI';

test('calls endpoint', async () => {
  await expect(callExternal('x')).resolves.toBe('called x');
});
