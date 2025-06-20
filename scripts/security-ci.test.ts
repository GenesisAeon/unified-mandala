import fs from 'fs';

test('gateway config contains mTLS and JWT', () => {
  const raw = fs.readFileSync('config/mtls-kong-gateway.yaml', 'utf8');
  expect(raw).toContain('jwt_sign_key');
  expect(raw).toContain('cert');
});
