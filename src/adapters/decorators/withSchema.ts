import { Adapter, AdapterInput, AdapterResult } from "../base";
import { ZodSchema } from "zod";

export function withSchema<T>(schema: ZodSchema<T>) {
  return (next: Adapter<T>): Adapter<T> => {
    return async (input?: AdapterInput): Promise<AdapterResult<T>> => {
      const res = await next(input);
      if (!res.ok) return res;
      const parsed = schema.safeParse(res.data);
      if (!parsed.success) {
        return { ok: false, error: "Schema validation failed", meta: { issues: parsed.error.issues } };
      }
      return { ...res, data: parsed.data };
    };
  };
}
