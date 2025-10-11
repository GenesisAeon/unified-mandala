import { Adapter } from './base';
import { withRetry } from './decorators/withRetry';
import { withRateLimit } from './decorators/withRateLimit';
import { withCache } from './decorators/withCache';
import { withSchema } from './decorators/withSchema';

import { era5Raw, Era5Sample } from './impl/era5.stub';
import { oisstRaw, OisstSample } from './impl/oisst.stub';
import { z } from 'zod';

// Schemata
const Era5Schema = z.object({
  location: z.string(),
  values: z.array(z.number()),
  unit: z.union([z.literal('K'), z.literal('°C')]),
});
const OisstSchema = z.object({
  region: z.string(),
  sst: z.array(z.number()),
  unit: z.literal('°C'),
});

// Globale Policies (können je Adapter abweichen)
const retry = <T>(next: Adapter<T>) =>
  withRetry<T>({ retries: 3, backoffMs: 200, maxBackoffMs: 2000, jitter: true })(next);
const rate = <T>(next: Adapter<T>) => withRateLimit<T>({ capacity: 5, intervalMs: 1000 })(next);
const cache60s = <T>(next: Adapter<T>) => withCache<T>({ ttlMs: 60_000 })(next);

export const era5 = withSchema<Era5Sample>(Era5Schema)(cache60s(rate(retry(era5Raw))));

export const oisst = withSchema<OisstSample>(OisstSchema)(cache60s(rate(retry(oisstRaw))));

// Re-Exports
export * from './base';
export { Era5Schema, OisstSchema };
