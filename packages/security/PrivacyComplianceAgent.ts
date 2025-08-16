export interface DataOperation {
  /** Fields that will be read or written by the operation. */
  fields: string[];
  /** Whitelisted fields permitted for the operation. */
  allowed: string[];
}

export interface ComplianceResult {
  /** Whether the operation only touches allowed fields. */
  compliant: boolean;
  /** Any fields that are not permitted. */
  violations: string[];
}

/**
 * Check if a data operation respects the defined privacy policy.
 * Returns both a boolean flag and a list of violating fields to
 * enable detailed logging by callers.
 */
export function checkCompliance(op: DataOperation): ComplianceResult {
  const violations = op.fields.filter(f => !op.allowed.includes(f));
  return { compliant: violations.length === 0, violations };
}
