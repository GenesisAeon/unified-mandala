import { ConsentRegistry } from './ConsentRegistry';
import { AuditTrail } from './AuditTrail';

const ALLOWED_REGIONS = ['eu', 'us'];
const APPROVED_MODELS = ['gpt-4o', 'gpt-4.1'];

export interface PolicyOptions {
  personId: string;
  region: string;
  model: string;
  reviewed?: boolean;
}

export function requireConsent(personId: string): void {
  if (!ConsentRegistry.hasConsent(personId)) {
    AuditTrail.record({ personId, action: 'consent_missing' });
    throw new Error(`Consent required for PII research: ${personId}`);
  }
}

export function enforcePolicy(opts: PolicyOptions): void {
  requireConsent(opts.personId);
  if (!ALLOWED_REGIONS.includes(opts.region)) {
    AuditTrail.record({ personId: opts.personId, action: 'region_block', region: opts.region });
    throw new Error(`Region not allowed: ${opts.region}`);
  }
  if (!APPROVED_MODELS.includes(opts.model)) {
    AuditTrail.record({ personId: opts.personId, action: 'model_block', model: opts.model });
    throw new Error(`Model not allowed: ${opts.model}`);
  }
  if (!opts.reviewed) {
    AuditTrail.record({ personId: opts.personId, action: 'review_required', model: opts.model });
    throw new Error('Review required');
  }
  AuditTrail.record({ personId: opts.personId, action: 'policy_pass', region: opts.region, model: opts.model });
}
