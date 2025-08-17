export class PIIRedactor {
  private static email = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
  private static phone = /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?){2}\d{4}/g;
  private static card = /\b(?:\d[ -]*?){13,16}\b/g;

  static redact(text: string): string {
    return text
      .replace(this.email, '[REDACTED_EMAIL]')
      .replace(this.phone, '[REDACTED_PHONE]')
      .replace(this.card, '[REDACTED_CARD]');
  }
}

export default PIIRedactor;
