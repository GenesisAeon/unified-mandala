import { SignedURL } from '../packages/security/SignedURL';

describe('SignedURL', () => {
  const secret = 'test-secret';

  it('signs and verifies a URL', () => {
    const signer = new SignedURL(secret);
    const signed = signer.sign('https://example.com/data', 60);
    expect(signer.verify(signed)).toBe(true);
  });

  it('rejects expired URLs', () => {
    const signer = new SignedURL(secret);
    const signed = signer.sign('https://example.com/data', -5);
    expect(signer.verify(signed)).toBe(false);
  });

  it('rejects tampered URLs', () => {
    const signer = new SignedURL(secret);
    const signed = signer.sign('https://example.com/data', 60);
    const url = new URL(signed);
    const exp = url.searchParams.get('exp');
    if (exp) {
      url.searchParams.set('exp', (parseInt(exp, 10) + 1).toString());
    }
    expect(signer.verify(url.toString())).toBe(false);
  });
});
