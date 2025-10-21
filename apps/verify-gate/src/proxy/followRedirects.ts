import { pinnedRequest } from './pinnedRequest.js';
import { assertAllowed, type AllowResult, SSRFDenyError } from '../security/ssrf.js';
import { incRedirectBlock, redirectFollow } from '../metrics.js';
import { RedirectBadSchemeError, RedirectPrivateTargetError, RedirectTooManyError } from '../errors.js';

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

export async function followRedirectsWithPreflight(
  start: URL,
  startCtx: RedirectContext,
  maxHops = 3,
): Promise<RedirectResult> {
  let currentUrl = new URL(start.toString());
  let ctx: RedirectContext = { allow: startCtx.allow };
  const startHost = start.hostname;
  const schemeHistory = [currentUrl.protocol.replace(/:$/, '')];

  for (let hop = 0; hop < maxHops; hop += 1) {
    // Ensure the current hop is still allowlisted before any network I/O
    if (hop > 0) {
      try {
        ctx = { allow: await assertAllowed(currentUrl.toString()) };
      } catch (error) {
        if (error instanceof SSRFDenyError) {
          incRedirectBlock('private-target', startHost);
          throw new RedirectPrivateTargetError(error.message);
        }
        throw error;
      }
    }

    let headResponse: Awaited<ReturnType<typeof pinnedRequest>> | undefined;
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
        incRedirectBlock('bad-scheme', startHost);
        throw new RedirectBadSchemeError('redirect_scheme_not_allowed');
      }

      let allowNext: AllowResult;
      try {
        allowNext = await assertAllowed(next.toString());
      } catch (error) {
        if (error instanceof SSRFDenyError) {
          incRedirectBlock('private-target', startHost);
          throw new RedirectPrivateTargetError(error.message);
        }
        throw error;
      }

      currentUrl = next;
      ctx = { allow: allowNext };
      schemeHistory.push(currentUrl.protocol.replace(/:$/, ''));
    } finally {
      headResponse?.dispose();
    }
  }

  incRedirectBlock('too-many', startHost);
  throw new RedirectTooManyError('too_many_redirects');
}

export const followRedirects = followRedirectsWithPreflight;

export {
  RedirectBadSchemeError,
  RedirectPrivateTargetError,
  RedirectTooManyError,
};
