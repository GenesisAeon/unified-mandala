export function getGrafanaBaseUrl(): string {
  const envUrl = ((import.meta as any)?.env?.VITE_GRAFANA_URL as string) || undefined;
  let ls = '';
  try {
    ls = typeof window !== 'undefined' && (window as any).localStorage?.getItem('mandala_grafana_url') || '';
  } catch {
    ls = '';
  }
  return (ls || envUrl || 'http://localhost:3000').replace(/\/+$/, '');
}

export function openGrafanaExplore(traceql: string, dsName = 'Tempo', from = 'now-1h', to = 'now') {
  const base = getGrafanaBaseUrl();
  const left = {
    datasource: dsName,
    queries: [{ query: traceql, refId: 'A' }],
    range: { from, to },
  } as any;
  const url = `${base}/explore?left=${encodeURIComponent(JSON.stringify(left))}`;
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export function isGrafanaUrlValid(u: string | undefined | null): boolean {
  if (!u) return false;
  try {
    const url = new URL(u);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
