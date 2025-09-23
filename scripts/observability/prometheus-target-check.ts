import process from 'node:process';

interface PrometheusTargetsResponse {
  status: string;
  data?: {
    activeTargets?: PrometheusTarget[];
    droppedTargets?: PrometheusTarget[];
  };
}

interface PrometheusTarget {
  scrapeUrl?: string;
  lastScrape?: string;
  lastError?: string;
  health?: string;
  labels?: Record<string, string>;
}

interface GrafanaHealthResponse {
  database?: string;
  version?: string;
  commit?: string;
}

const prometheusBase = normaliseBase(process.env.PROMETHEUS_URL ?? 'http://localhost:9090');
const grafanaBase = normaliseBase(process.env.GRAFANA_URL ?? 'http://localhost:3300');
const requireActiveTargets = envFlag('PROMETHEUS_REQUIRE_ACTIVE', true);
const checkGrafana = envFlag('OBSERVABILITY_SKIP_GRAFANA', false) === false;
const timeoutMs = envNumber('OBSERVABILITY_CHECK_TIMEOUT_MS', 8000);

(async () => {
  try {
    const promResult = await verifyPrometheusTargets(prometheusBase, timeoutMs);
    if (requireActiveTargets && promResult.activeCount === 0) {
      throw new Error(
        `Prometheus at ${promResult.endpoint} reported no active targets. Start a service exposing /metrics or set PROMETHEUS_REQUIRE_ACTIVE=0.`,
      );
    }

    if (promResult.unhealthy.length > 0) {
      const detail = promResult.unhealthy.map((target) => describeTarget(target)).join(', ');
      throw new Error(
        `Prometheus reported ${promResult.unhealthy.length} unhealthy target(s): ${detail}. Check the emitting service logs or adjust PROMETHEUS_REQUIRE_ACTIVE.`,
      );
    }

    console.log(
      `✅ Prometheus targets OK (${promResult.activeCount} active, ${promResult.droppedCount} dropped) at ${promResult.endpoint}.`,
    );

    if (checkGrafana) {
      const grafanaResult = await verifyGrafana(grafanaBase, timeoutMs);
      if (!grafanaResult.healthy) {
        throw new Error(grafanaResult.message);
      }
      console.log(`✅ Grafana health OK at ${grafanaResult.endpoint}${grafanaResult.versionHint}`);
    } else {
      console.log('ℹ️  Grafana check skipped (set OBSERVABILITY_SKIP_GRAFANA=0 to enforce).');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Observability check failed: ${message}`);
    process.exit(1);
  }
})();

function envFlag(name: string, defaultValue: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined) {
    return defaultValue;
  }
  const normalised = raw.trim().toLowerCase();
  if (['0', 'false', 'off', 'no'].includes(normalised)) {
    return false;
  }
  if (['1', 'true', 'on', 'yes'].includes(normalised)) {
    return true;
  }
  return defaultValue;
}

function envNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function normaliseBase(input: string): string {
  return input.replace(/\/+$/, '');
}

async function verifyPrometheusTargets(base: string, timeout: number) {
  const endpoint = `${base}/api/v1/targets`;
  console.log(`Checking Prometheus targets at ${endpoint} ...`);

  const response = await fetchWithTimeout(endpoint, timeout);
  if (!response.ok) {
    throw new Error(`Prometheus responded with status ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as PrometheusTargetsResponse;
  if (payload.status !== 'success' || !payload.data) {
    throw new Error(
      `Prometheus returned unexpected payload: ${JSON.stringify(payload).slice(0, 200)}...`,
    );
  }

  const active = Array.isArray(payload.data.activeTargets) ? payload.data.activeTargets : [];
  const dropped = Array.isArray(payload.data.droppedTargets) ? payload.data.droppedTargets : [];
  const unhealthy = active.filter((target) => target.health && target.health !== 'up');

  return {
    endpoint,
    activeCount: active.length,
    droppedCount: dropped.length,
    unhealthy,
  };
}

async function verifyGrafana(base: string, timeout: number) {
  const endpoint = `${base}/api/health`;
  console.log(`Checking Grafana health at ${endpoint} ...`);

  const response = await fetchWithTimeout(endpoint, timeout);
  if (response.status === 401) {
    return {
      endpoint,
      healthy: true,
      versionHint: ' (authentication required; health endpoint reachable)',
    } as const;
  }

  if (!response.ok) {
    return {
      endpoint,
      healthy: false,
      message: `Grafana health endpoint responded with ${response.status} ${response.statusText}`,
      versionHint: '',
    } as const;
  }

  let body: GrafanaHealthResponse | undefined;
  try {
    body = (await response.json()) as GrafanaHealthResponse;
  } catch (error) {
    return {
      endpoint,
      healthy: false,
      message: `Grafana health endpoint did not return JSON (${error instanceof Error ? error.message : String(error)})`,
      versionHint: '',
    } as const;
  }

  if (body?.database && body.database.toLowerCase() !== 'ok') {
    return {
      endpoint,
      healthy: false,
      message: `Grafana reported database state '${body.database}'.`,
      versionHint: '',
    } as const;
  }

  const version = body?.version ? ` (version ${body.version})` : '';
  return {
    endpoint,
    healthy: true,
    message: '',
    versionHint: version,
  } as const;
}

async function fetchWithTimeout(url: string, timeout: number) {
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, {
      signal: controller.signal,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Request to ${url} failed: ${message}`);
  } finally {
    clearTimeout(timeoutHandle);
  }
}

function describeTarget(target: PrometheusTarget): string {
  if (target.scrapeUrl) {
    return `${target.scrapeUrl} (${target.health ?? 'unknown'})`;
  }
  if (target.labels && target.labels.instance) {
    return `${target.labels.instance} (${target.health ?? 'unknown'})`;
  }
  return `unknown target (${target.health ?? 'unknown'})`;
}
