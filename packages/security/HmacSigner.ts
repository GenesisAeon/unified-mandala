import crypto from 'crypto';

export class HmacSigner {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  sign(payload: object | string): string {
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return crypto.createHmac('sha256', this.secret).update(data).digest('hex');
  }

  verify(payload: object | string, signature: string): boolean {
    const expected = this.sign(payload);
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  }
}
