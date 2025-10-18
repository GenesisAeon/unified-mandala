import type { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    id?: string;
  }
}

declare module 'express' {
  interface Response {
    locals: Record<string, unknown> & {
      requestId?: string;
    };
  }
}

export type RequestWithId = Request & { id?: string };
