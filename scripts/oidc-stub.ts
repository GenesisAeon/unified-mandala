import express from 'express';
import { generateKeyPairSync } from 'crypto';
import jwt from 'jsonwebtoken';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = publicKey.export({ format: 'jwk' }) as any;
jwk.use = 'sig';
jwk.alg = 'RS256';
jwk.kid = 'dev-key';

const app = express();
app.use(express.json());

app.get('/.well-known/jwks.json', (_req, res) => {
  res.json({ keys: [jwk] });
});

app.post('/token', (req, res) => {
  const sub = (req.body && req.body.sub) || 'dev-user';
  const token = jwt.sign({ sub }, privateKey, {
    algorithm: 'RS256',
    expiresIn: '1h',
    keyid: jwk.kid,
    issuer: 'oidc-stub'
  });
  res.json({ access_token: token, token_type: 'Bearer', expires_in: 3600 });
});

const port = Number(process.env.PORT) || 4009;
app.listen(port, () => {
  console.log(`OIDC stub listening on :${port}`);
});
