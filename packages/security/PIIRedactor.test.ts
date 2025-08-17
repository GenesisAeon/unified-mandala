import { PIIRedactor } from './PIIRedactor';

describe('PIIRedactor', () => {
  it('redacts emails', () => {
    const input = 'Contact me at test@example.com';
    expect(PIIRedactor.redact(input)).toBe('Contact me at [REDACTED_EMAIL]');
  });

  it('redacts phone numbers', () => {
    const input = 'Call me at +1 555-123-4567 tomorrow';
    expect(PIIRedactor.redact(input)).toBe('Call me at [REDACTED_PHONE] tomorrow');
  });

  it('redacts credit card numbers', () => {
    const input = 'Use card 4111 1111 1111 1111 for payment';
    expect(PIIRedactor.redact(input)).toBe('Use card [REDACTED_CARD] for payment');
  });

  it('leaves other text unchanged', () => {
    const input = 'No sensitive data here';
    expect(PIIRedactor.redact(input)).toBe(input);
  });
});
