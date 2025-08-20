import crypto from 'crypto';
import { URL } from 'url';

export class SignedURL {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  sign(rawUrl: string, expiresInSeconds: number): string {
    const url = new URL(rawUrl);
    const expiry = Math.floor(Date.now() / 1000) + expiresInSeconds;
    url.searchParams.set('exp', expiry.toString());
    const data = this.dataToSign(url);
    const sig = crypto.createHmac('sha256', this.secret).update(data).digest('hex');
    url.searchParams.set('sig', sig);
    return url.toString();
  }

  verify(signedUrl: string): boolean {
    const url = new URL(signedUrl);
    const sig = url.searchParams.get('sig');
    const exp = url.searchParams.get('exp');
    if (!sig || !exp) return false;
    const expiry = parseInt(exp, 10);
    if (isNaN(expiry) || expiry < Math.floor(Date.now() / 1000)) {
      return false;
    }
    url.searchParams.delete('sig');
    const data = this.dataToSign(url);
    const expected = crypto.createHmac('sha256', this.secret).update(data).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  }

  private dataToSign(url: URL): string {
    url.searchParams.sort();
    return `${url.pathname}?${url.searchParams.toString()}`;
  }
}
