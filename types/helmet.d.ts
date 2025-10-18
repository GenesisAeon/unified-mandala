declare module 'helmet' {
  import type { RequestHandler } from 'express';

  type HelmetOptions = Record<string, unknown>;

  function helmet(options?: HelmetOptions): RequestHandler;

  export = helmet;
}
