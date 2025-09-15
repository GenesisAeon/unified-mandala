import { z } from 'zod';

export const KpiMetricSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number(),
  unit: z.string().optional(),
  trend: z.enum(['up', 'down', 'flat']).optional(),
  delta: z.number().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  updated: z.string().optional(),
  meta: z.record(z.unknown()).optional()
});

export const KpiListSchema = z.object({
  updated: z.string().optional(),
  items: z.array(KpiMetricSchema)
});

export type KpiList = z.infer<typeof KpiListSchema>;
export type KpiMetric = z.infer<typeof KpiMetricSchema>;

export const ResonanceOutSchema = z.object({
  resonance: z.number().min(0).max(1),
  updated: z.string().optional(),
  meta: z.record(z.unknown()).optional()
});

export type ResonanceOut = z.infer<typeof ResonanceOutSchema>;

export const HealthSchema = z.object({
  status: z.string(),
  ts: z.string(),
  version: z.string(),
  node: z.string(),
  pid: z.number()
});

export type HealthInfo = z.infer<typeof HealthSchema>;

export type RepoMapEntry = {
  id?: string;
  name?: string;
  title?: string;
  path?: string;
  type?: string;
  description?: string;
  tags?: string[];
  meta?: Record<string, unknown>;
  children?: RepoMapEntry[];
};

export const RepoMapEntrySchema: z.ZodType<RepoMapEntry> = z.lazy(() =>
  z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    title: z.string().optional(),
    path: z.string().optional(),
    type: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    meta: z.record(z.unknown()).optional(),
    children: z.array(RepoMapEntrySchema).optional()
  })
);

export const RepoLevelSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  entries: z.array(RepoMapEntrySchema)
});

export const RepoMapSchema = z.object({
  name: z.string(),
  generated: z.string().optional(),
  updated: z.string().optional(),
  ebenen: z.array(RepoLevelSchema)
});

export type RepoLevel = z.infer<typeof RepoLevelSchema>;
export type RepoMap = z.infer<typeof RepoMapSchema>;
