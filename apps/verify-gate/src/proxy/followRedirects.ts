import { request } from 'undici';
import {
  resolveHostStrictTTL,
  SSRFPrivateTargetError,
  type ResolveResult,
} from '../security/resolve.js';
import { isPrivateOrBlocked } from '../security/ipRanges.js';
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

type RedirectResult = {
  final: URL;
  hops: number;
  lastResolve?: ResolveResult;
};

export async function followRedirects(start: URL, maxHops = 3): Promise<RedirectResult> {
  let url = new URL(start.toString());
  const startHost = url.hostname;
  let hops = 0;
  let lastResolve: ResolveResult | undefined;

  for (; hops < maxHops; hops += 1) {
    let head;
    try {
      head = await request(url, { method: 'HEAD', maxRedirections: 0 });
    } catch {
      redirectFollow.inc({ hops: String(hops), start_host: startHost });
      return { final: url, hops, lastResolve };
    }
    const rawLocation = head.headers.location;
    const location = Array.isArray(rawLocation) ? rawLocation[0] : rawLocation;
    if (!location || head.statusCode < 300 || head.statusCode > 399) {
      redirectFollow.inc({ hops: String(hops), start_host: startHost });
      return { final: url, hops, lastResolve };
    }

    const next = new URL(location, url);
    if (!/^https?:$/.test(next.protocol)) {
      redirectBlocks.inc({ reason: 'bad-scheme', start_host: startHost });
      throw new RedirectBadSchemeError('redirect_scheme_not_allowed');
    }

    try {
      const resolved = await resolveHostStrictTTL(next.hostname);
      if (resolved.ips.some(isPrivateOrBlocked)) {
        redirectBlocks.inc({ reason: 'private-target', start_host: startHost });
        throw new RedirectPrivateTargetError('redirect_target_private');
      }
      lastResolve = resolved;
    } catch (error) {
      if (error instanceof SSRFPrivateTargetError || (error as { code?: string }).code === 'SSRFPrivateTargetError') {
        redirectBlocks.inc({ reason: 'private-target', start_host: startHost });
      }
      throw error;
    }

    url = next;
  }

  redirectBlocks.inc({ reason: 'too-many', start_host: startHost });
  throw new RedirectTooManyError('too_many_redirects');
}
