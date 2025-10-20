import { pinnedRequest } from './pinnedRequest.js';
import { assertAllowed, type AllowResult, SSRFDenyError } from '../security/ssrf.js';
import { redirectBlocks, redirectFollow } from '../metrics.js';

export class RedirectBadSchemeError extends Error {
  public readonly code = 'REDIRECT_BAD_SCHEME' as const;
}

export class RedirectTooManyError extends Error {
  public readonly code = 'REDIRECT_TOO_MANY' as const;
}

export class RedirectPrivateTargetError extends Error {
  public readonly code = 'REDIRECT_PRIVATE' as const;
}

export type RedirectContext = {
  allow: AllowResult;
};

export type RedirectResult = {
  final: URL;
  hops: number;
  ctx: RedirectContext;
  schemeHistory: string[];
};

function extractLocation(headers: import('undici').Dispatcher.ResponseData['headers']): string | undefined {
  const raw = headers.location;
  if (!raw) {
    return undefined;
  }
  return Array.isArray(raw) ? raw[0] : raw;
}

export async function followRedirects(
  start: URL,
  startCtx: RedirectContext,
  maxHops = 3,
): Promise<RedirectResult> {
  let currentUrl = new URL(start.toString());
  let ctx: RedirectContext = { allow: startCtx.allow };
  const startHost = start.hostname;
  const schemeHistory = [currentUrl.protocol.replace(/:$/, '')];

  for (let hop = 0; hop < maxHops; hop += 1) {
    let headResponse: Awaited<ReturnType<typeof pinnedRequest>>;
    try {
      headResponse = await pinnedRequest({
        originalUrl: currentUrl,
        pinnedIp: ctx.allow.ip,
        minTTLsec: ctx.allow.minTTLsec,
        method: 'HEAD',
        headers: {
          accept: '*/*',
          'user-agent': 'verify-gate/redirect-probe',
        },
        headersTimeoutMs: 5000,
        bodyTimeoutMs: 5000,
      });
    } catch {
      redirectFollow.inc({ hops: String(hop), start_host: startHost });
      return { final: currentUrl, hops: hop, ctx, schemeHistory };
    }

    try {
      const { res } = headResponse;
      const { statusCode } = res;
      if (!statusCode || statusCode < 300 || statusCode > 399) {
        redirectFollow.inc({ hops: String(hop), start_host: startHost });
        return { final: currentUrl, hops: hop, ctx, schemeHistory };
      }

      const location = extractLocation(res.headers);
      if (!location) {
        redirectFollow.inc({ hops: String(hop), start_host: startHost });
        return { final: currentUrl, hops: hop, ctx, schemeHistory };
      }

      const next = new URL(location, currentUrl);
      if (!/^https?:$/.test(next.protocol)) {
        redirectBlocks.inc({ reason: 'bad-scheme', start_host: startHost });
        throw new RedirectBadSchemeError('redirect_scheme_not_allowed');
      }

      let allowNext: AllowResult;
      try {
        allowNext = await assertAllowed(next.toString());
      } catch (error) {
        if (error instanceof SSRFDenyError) {
          redirectBlocks.inc({ reason: 'private-target', start_host: startHost });
          throw new RedirectPrivateTargetError(error.message);
        }
        throw error;
      }

      currentUrl = next;
      ctx = { allow: allowNext };
      schemeHistory.push(currentUrl.protocol.replace(/:$/, ''));
    } finally {
      headResponse.dispose();
    }
  }

  redirectBlocks.inc({ reason: 'too-many', start_host: startHost });
  throw new RedirectTooManyError('too_many_redirects');
}
