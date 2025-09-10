import { z } from "zod";

export const CREPSchema = z.object({
  score: z.number().min(0).max(1).optional(),
  coherence: z.number().min(0).max(1).optional(),
  resonance: z.number().min(0).max(1).optional(),
  emergence: z.number().min(0).max(1).optional(),
  poetics: z.number().min(0).max(1).optional(),
}).strict();
