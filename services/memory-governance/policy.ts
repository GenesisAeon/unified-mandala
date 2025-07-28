import { MemoryCategory } from '../memory-manager';

export interface MemoryGovernancePolicy {
  retentionLimits: Record<MemoryCategory, number>;
}

export const DefaultPolicy: MemoryGovernancePolicy = {
  retentionLimits: {
    daily: 50,
    weekly: 200,
    longterm: 1000,
  },
};

export function shouldCleanup(
  category: MemoryCategory,
  currentCount: number,
  policy: MemoryGovernancePolicy = DefaultPolicy,
): boolean {
  return currentCount > policy.retentionLimits[category];
}
