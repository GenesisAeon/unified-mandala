import { setTimeout as delay } from 'node:timers/promises';
import { fetch } from 'undici';

type JsonHeaders = Record<string, string>;

export interface FetchJsonOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  headers?: JsonHeaders;
  timeoutMs?: number;
  retries?: number;
  retryOn?: number[];
}

export interface JsonSuccess<T> {
  ok: true;
  status: number;
  data: T;
}

export interface JsonFailure {
  ok: false;
  status: number | null;
  error: string;
}

export type JsonResult<T> = JsonSuccess<T> | JsonFailure;

const defaultRetryStatuses = [500, 502, 503, 504];

export async function fetchJson<T>(url: string, options: FetchJsonOptions = {}): Promise<JsonResult<T>> {
  const {
    method = 'POST',
    body,
    headers = {},
    timeoutMs = 1_500,
    retries = 2,
    retryOn = defaultRetryStatuses,
  } = options;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const baseHeaders: JsonHeaders = {
        'content-type': 'application/json',
        ...headers,
      };
      if (!baseHeaders.authorization && process.env.INTERNAL_BEARER) {
        baseHeaders.authorization = `Bearer ${process.env.INTERNAL_BEARER}`;
      }

      const response = await fetch(url, {
        method,
        headers: baseHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!response.ok) {
        if (attempt < retries && retryOn.includes(response.status)) {
          clearTimeout(timeout);
          await delay(jitterDelay(attempt));
          continue;
        }

        return { ok: false, status: response.status, error: `HTTP_${response.status}` };
      }

      const data = (await response.json()) as T;
      return { ok: true, status: response.status, data };
    } catch (error) {
      if (attempt < retries) {
        clearTimeout(timeout);
        await delay(jitterDelay(attempt));
        continue;
      }

      const reason = error instanceof Error ? error.name === 'AbortError' ? 'TIMEOUT' : error.message : 'NETWORK_ERROR';
      return { ok: false, status: null, error: reason ?? 'NETWORK_ERROR' };
    } finally {
      clearTimeout(timeout);
    }
  }

  return { ok: false, status: null, error: 'UNKNOWN_ERROR' };
}

function jitterDelay(attempt: number): number {
  const base = (attempt + 1) * 150;
  const jitter = Math.floor(Math.random() * 100);
  return base + jitter;
}
