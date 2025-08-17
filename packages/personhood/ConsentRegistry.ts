export class ConsentRegistry {
  private static consentMap = new Map<string, boolean>();

  static grant(personId: string) {
    this.consentMap.set(personId, true);
  }

  static revoke(personId: string) {
    this.consentMap.delete(personId);
  }

  static hasConsent(personId: string): boolean {
    return this.consentMap.get(personId) === true;
  }
}
