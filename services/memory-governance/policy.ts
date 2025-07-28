export interface PolicyRule {
  category: string;
  maxAgeDays: number;
  maxEntries: number;
}

export const defaultPolicy: PolicyRule[] = [
  { category: 'daily', maxAgeDays: 7, maxEntries: 100 },
  { category: 'weekly', maxAgeDays: 30, maxEntries: 200 },
  { category: 'longterm', maxAgeDays: 365, maxEntries: 1000 }
];
