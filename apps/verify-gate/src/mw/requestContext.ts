import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export function requestContext() {
  return (req: Request, res: Response, next: NextFunction) => {
    const existing = req.headers['x-request-id'];
    const rid = typeof existing === 'string' && existing.length > 0 ? existing : randomUUID();
    const headers = req.headers as Record<string, unknown>;
    if (!headers['x-request-id']) {
      headers['x-request-id'] = rid;
    }
    (req as Request & { rid?: string }).rid = rid;
    res.locals.requestId = rid;
    res.setHeader('x-request-id', rid);
    next();
  };
}
