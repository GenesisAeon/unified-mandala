import { AsyncLocalStorage } from "async_hooks";
export type Ctx = { requestId?: string; agent?: string; user?: string; extra?: Record<string, unknown> };
export const ctxStore = new AsyncLocalStorage<Ctx>();
export const getCtx = () => ctxStore.getStore() || {};
export const runWithCtx = <T>(ctx: Ctx, fn: () => T) => ctxStore.run(ctx, fn);
