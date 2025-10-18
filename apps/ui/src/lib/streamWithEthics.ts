import type { EthicsMeta } from './fetchWithEthics';

export async function streamWithEthics(
  input: RequestInfo | URL,
  init?: RequestInit & { jsonBody?: unknown },
  onChunk?: (text: string) => void,
): Promise<{ ethics: EthicsMeta; status: number; response: Response }> {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  const body =
    init?.jsonBody !== undefined
      ? JSON.stringify(init.jsonBody)
      : (init?.body as BodyInit | null | undefined);

  const response = await fetch(input, { ...init, headers, body });

  const ethics: EthicsMeta = {
    verdict: (response.headers.get('x-ethics-verdict') ?? 'unknown') as EthicsMeta['verdict'],
    evidenceCount: Number(response.headers.get('x-ethics-evidence-count') ?? '0'),
  };

  if (!response.body) {
    return { ethics, status: response.status, response };
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) {
      onChunk?.(decoder.decode(value, { stream: true }));
    }
  }

  return { ethics, status: response.status, response };
}
