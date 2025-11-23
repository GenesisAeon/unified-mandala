import { Agent, Headers, request } from 'undici';
import tls from 'node:tls';
import net from 'node:net';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { incIpMismatch, incTlsNameMismatch } from '../metrics.js';
import { normalizeIp } from '../security/ipRanges.js';
import {
  IpMismatchError,
  TlsNameMismatchError,
  UpstreamBadGatewayError,
  UpstreamTimeoutError,
} from '../errors.js';

export type PinnedRequestOptions = {
  originalUrl: URL;
  pinnedIp: string;
  minTTLsec: number;
  method: string;
  headers: Record<string, string | string[] | undefined>;
  body?: string | Buffer | null;
  signal?: AbortSignal;
  bodyTimeoutMs?: number;
  headersTimeoutMs?: number;
};

export type PinnedRequestResult = {
  res: import('undici').Dispatcher.ResponseData;
  remoteIp?: string;
  sanOk?: boolean;
  pipeTo(response: import('express').Response): Promise<void>;
  dispose(): void;
};

type ConnectionTelemetry = {
  remoteIp?: string;
  sanOk?: boolean;
};

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-connection',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'transfer-encoding',
  'upgrade',
  'trailer',
  'content-length',
  'host',
  'via',
  'expect',
]);

function sanitizeHeaders(headers: Record<string, string | string[] | undefined>, host: string): Headers {
  const filtered = new Headers();
  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined) {
      continue;
    }
    const normalizedKey = key.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(normalizedKey) || normalizedKey.startsWith('proxy-')) {
      continue;
    }
    if (Array.isArray(value)) {
      for (const entry of value) {
        filtered.append(normalizedKey, entry);
      }
    } else {
      filtered.append(normalizedKey, value);
    }
  }
  filtered.set('host', host);
  return filtered;
}

function makePinnedConnector(pinnedIp: string, host: string, telemetry: ConnectionTelemetry, isHttps: boolean) {
  const normalizedPinned = normalizeIp(pinnedIp);
  return function connect(
    opts: any,
    cb: (err: Error | null, socket: tls.TLSSocket | net.Socket | null) => void,
  ) {
    const protocol = typeof opts?.protocol === 'string' ? opts.protocol : isHttps ? 'https:' : 'http:';
    const port = Number(opts?.port ?? (protocol === 'https:' ? 443 : 80));
    const prefersHttps = protocol === 'https:';

    const finalize = (socket: tls.TLSSocket | net.Socket) => {
      const remote = normalizeIp((socket as tls.TLSSocket).remoteAddress ?? '');
      if (remote) {
        telemetry.remoteIp = remote;
      }
      if (remote && normalizedPinned && remote !== normalizedPinned) {
        incIpMismatch(host);
        socket.destroy(new IpMismatchError());
        return;
      }
      cb(null, socket);
    };

    if (prefersHttps) {
      let sanValid = true;
      const socket = tls.connect({
        host: pinnedIp,
        port,
        servername: host,
        checkServerIdentity: (_hostname, cert) => {
          const err = tls.checkServerIdentity(host, cert);
          if (err) {
            sanValid = false;
            telemetry.sanOk = false;
            incTlsNameMismatch(host);
          }
          return err ?? undefined;
        },
      });
      socket.once('secureConnect', () => {
        if (sanValid) {
          telemetry.sanOk = true;
        }
        finalize(socket);
      });
      socket.once('error', (error) => {
        cb(error instanceof Error ? error : new Error(String(error)), null);
      });
      return socket;
    }

    const socket = net.connect({ host: pinnedIp, port });
    socket.once('connect', () => finalize(socket));
    socket.once('error', (error) => {
      cb(error instanceof Error ? error : new Error(String(error)), null);
    });
    return socket;
  };
}

export async function pinnedRequest(options: PinnedRequestOptions): Promise<PinnedRequestResult> {
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

  const telemetry: ConnectionTelemetry = {};
  const agentOptions: Agent.Options = {
    keepAliveTimeout: ttlCapMs,
    keepAliveMaxTimeout: ttlCapMs,
    connect: {
      connector: makePinnedConnector(pinnedIp, originalUrl.hostname, telemetry, isHttps),
    } as any,
  };

  const agent = new Agent(agentOptions);

  try {
    const normalizedMethod = method.toUpperCase() as import('undici').Dispatcher.HttpMethod;
    const res = await request(pinned, {
      method: normalizedMethod,
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
      remoteIp: telemetry.remoteIp,
      sanOk: telemetry.sanOk,
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
            : // @ts-ignore Node 18 exposes Readable.fromWeb
              Readable.fromWeb?.(rawBody as unknown as ReadableStream<unknown>) ?? Readable.from(rawBody as AsyncIterable<unknown>);

        await pipeline(nodeReadable, response);
      },
      dispose() {
        agent.close();
      },
    };
  } catch (error) {
    agent.close();
    if (error instanceof IpMismatchError || (error as { code?: string }).code === 'IP_MISMATCH') {
      throw new IpMismatchError();
    }
    if (error instanceof TlsNameMismatchError || (error as { code?: string }).code === 'TLS_NAME_MISMATCH') {
      throw new TlsNameMismatchError();
    }
    if ((error as { code?: string }).code === 'UND_ERR_HEADERS_TIMEOUT' || (error as { code?: string }).code === 'UND_ERR_BODY_TIMEOUT') {
      throw new UpstreamTimeoutError();
    }
    throw new UpstreamBadGatewayError((error as Error)?.message ?? 'upstream_failed');
  }
}
