import { Agent, Headers, request, buildConnector, type Dispatcher } from 'undici';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

export type PinnedRequestOptions = {
  originalUrl: URL;
  pinnedIp: string;
  minTTLsec: number;
  method: Dispatcher.HttpMethod;
  headers: Record<string, string | string[] | undefined>;
  body?: string | Buffer | null;
  signal?: AbortSignal;
  bodyTimeoutMs?: number;
  headersTimeoutMs?: number;
};

function sanitizeHeaders(headers: Record<string, string | string[] | undefined>, host: string): Headers {
  const filtered = new Headers();
  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined) {
      continue;
    }
    if (Array.isArray(value)) {
      for (const entry of value) {
        filtered.append(key, entry);
      }
    } else {
      filtered.append(key, value);
    }
  }
  filtered.set('host', host);
  return filtered;
}

export async function pinnedRequest(options: PinnedRequestOptions) {
  const {
    originalUrl,
    pinnedIp,
    minTTLsec,
    method,
    headers,
    body,
    signal,
    bodyTimeoutMs = Number.parseInt(process.env.VERIFY_GATE_UPSTREAM_BODY_TIMEOUT_MS ?? '60000', 10),
    headersTimeoutMs = Number.parseInt(process.env.VERIFY_GATE_UPSTREAM_HEADERS_TIMEOUT_MS ?? '15000', 10),
  } = options;

  const isHttps = originalUrl.protocol === 'https:';
  const pinned = new URL(originalUrl.toString());
  pinned.hostname = pinnedIp;
  if (!pinned.port) {
    pinned.port = isHttps ? '443' : '80';
  }

  const ttlCapMs = Math.max(
    1000,
    Math.min(
      minTTLsec * 1000,
      Number.parseInt(process.env.VERIFY_GATE_KEEPALIVE_MAX_MS ?? '30000', 10),
    ),
  );

  const agentOptions: Agent.Options = {
    keepAliveTimeout: ttlCapMs,
    keepAliveMaxTimeout: ttlCapMs,
  };

  if (isHttps) {
    agentOptions.connect = buildConnector({ servername: originalUrl.hostname });
  }

  const agent = new Agent(agentOptions);

  const res = await request(pinned, {
    method,
    headers: sanitizeHeaders(headers, originalUrl.host),
    body: body ?? null,
    dispatcher: agent,
    maxRedirections: 0,
    bodyTimeout: bodyTimeoutMs,
    headersTimeout: headersTimeoutMs,
    signal,
  });

  return {
    res,
    async pipeTo(response: import('express').Response) {
      for (const [key, value] of Object.entries(res.headers)) {
        if (/^(connection|keep-alive|proxy-connection|upgrade|te|transfer-encoding|content-length)$/i.test(key)) {
          continue;
        }
        if (Array.isArray(value)) {
          for (const entry of value) {
            response.append(key, entry);
          }
          continue;
        }
        if (typeof value === 'string') {
          if (key.toLowerCase() === 'set-cookie') {
            response.append(key, value);
          } else {
            response.setHeader(key, value);
          }
        }
      }
      response.status(res.statusCode);

      const rawBody = res.body;
      if (!rawBody) {
        response.end();
        return;
      }

      const nodeReadable =
        typeof (rawBody as unknown as { pipe: unknown }).pipe === 'function'
          ? (rawBody as NodeJS.ReadableStream)
          : // @ts-ignore - Node 18+ exposes Readable.fromWeb
            Readable.fromWeb?.(rawBody as unknown as ReadableStream<unknown>) ?? Readable.from(rawBody as AsyncIterable<unknown>);

      await pipeline(nodeReadable, response);
    },
    dispose() {
      agent.close();
    },
  };
}
