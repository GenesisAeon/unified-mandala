import fs from 'fs';

test('secure gateway config contains tls and jwt', () => {
  const content = fs.readFileSync('config/secure-gateway.yaml', 'utf-8');
  expect(content).toContain('mtls');
  expect(content).toContain('jwt');
});
