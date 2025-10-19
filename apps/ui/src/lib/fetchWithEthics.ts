export type DegradedMeta = {
  active: boolean;
  source?: string;
};

export type EthicsMeta = {
  verdict: 'green' | 'yellow' | 'red' | 'unknown';
  evidenceCount: number;
  degraded: DegradedMeta;
};

export async function fetchJsonWithEthics<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit & { jsonBody?: unknown },
): Promise<{ data: T; ethics: EthicsMeta; response: Response }> {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  const body =
    init?.jsonBody !== undefined
      ? JSON.stringify(init.jsonBody)
      : (init?.body as BodyInit | null | undefined);

  const response = await fetch(input, { ...init, headers, body });

  const verdict = (response.headers.get('x-ethics-verdict') ?? 'unknown') as EthicsMeta['verdict'];
  const evidenceCount = Number(response.headers.get('x-ethics-evidence-count') ?? '0');
  const degradedHeader = response.headers.get('x-verify-degraded');
  const trimmed = degradedHeader?.trim();
  const degraded: DegradedMeta =
    trimmed && trimmed.length > 0
      ? { active: true, source: trimmed === '1' ? undefined : trimmed }
      : { active: false };

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const data = (isJson ? await response.json() : await response.text()) as T;

  return { data, ethics: { verdict, evidenceCount, degraded }, response };
}
