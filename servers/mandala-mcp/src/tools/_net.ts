import { z } from 'zod';

const UrlSchema = z.string().url();
const DEFAULT_TIMEOUT_MS = 3000;
const ALLOWED_HOSTS = (process.env.MCP_ALLOWED_HOSTS ?? '127.0.0.1,localhost')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export function buildUrl(base: string, pathname: string): string {
  const parsed = new URL(UrlSchema.parse(base));
  if (!ALLOWED_HOSTS.includes(parsed.hostname.toLowerCase())) {
    throw createError('host_not_allowed');
  }
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(normalizedPath, parsed).toString();
}

export async function safeFetchJson(url: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw createError(`http_${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export function createError(code: string, message?: string) {
  const err = new Error(message ?? code);
  (err as any).code = code;
  return err;
}
