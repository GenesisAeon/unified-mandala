import { SignedURL } from './SignedURL';

describe('SignedURL', () => {
  const secret = 'share-secret';

  it('generates and verifies signed url', () => {
    const signer = new SignedURL(secret);
    const url = signer.sign('https://example.com/resource', 60);
    expect(signer.verify(url)).toBe(true);
  });

  it('rejects expired urls', () => {
    const signer = new SignedURL(secret);
    const url = signer.sign('https://example.com/resource', -10);
    expect(signer.verify(url)).toBe(false);
  });
});
