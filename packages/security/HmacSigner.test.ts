import { HmacSigner } from './HmacSigner';

describe('HmacSigner', () => {
  const secret = 'topsecret';
  it('signs and verifies payload', () => {
    const signer = new HmacSigner(secret);
    const payload = { msg: 'hello' };
    const sig = signer.sign(payload);
    expect(signer.verify(payload, sig)).toBe(true);
  });

  it('fails verification for altered payload', () => {
    const signer = new HmacSigner(secret);
    const payload = { msg: 'hello' };
    const sig = signer.sign(payload);
    expect(signer.verify({ msg: 'bye' }, sig)).toBe(false);
  });
});
