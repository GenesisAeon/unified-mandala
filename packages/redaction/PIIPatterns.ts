export const PII_PATTERNS: Record<string, RegExp> = {
  // Email addresses
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
  // North American phone numbers, optional country code
  phone: /\b(?:\+?\d{1,3}[\s-.]?)?(?:\(\d{3}\)|\d{3})[\s-.]?\d{3}[\s-.]?\d{4}\b/,
  // US Social Security Number
  ssn: /\b\d{3}-\d{2}-\d{4}\b/,
  // Generic credit card numbers (13-16 digits)
  creditCard: /\b(?:\d[ -]*?){13,16}\b/,
  // International Bank Account Number (IBAN)
  iban: /\b[A-Z]{2}\d{2}[A-Z0-9]{1,30}\b/,
  // Passport number (simple heuristic)
  passport: /\b[A-PR-WY][1-9]\d{1,7}\b/,
};

export type PIIPattern = keyof typeof PII_PATTERNS;

/**
 * Retrieve a specific PII pattern by name.
 */
export function getPIIPattern(name: PIIPattern): RegExp {
  return PII_PATTERNS[name];
}
