import { ConsentRegistry } from './ConsentRegistry';

export function requireConsent(personId: string): void {
  if (!ConsentRegistry.hasConsent(personId)) {
    throw new Error(`Consent required for PII research: ${personId}`);
  }
}
