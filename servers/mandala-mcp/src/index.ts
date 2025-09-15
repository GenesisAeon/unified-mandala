import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { AuditLogger } from './audit.js';
import { ToolRateLimiter } from './limiter.js';
import { loadKpiList } from './tools/kpi.js';
import { loadResonance } from './tools/crep.js';
import { loadRepoMap } from './tools/repoMap.js';
import { health } from './tools/health.js';
import { hashObject } from './utils/hash.js';
import { createError } from './tools/_net.js';
import {
  HealthInfo,
  HealthSchema,
  KpiList,
  KpiListSchema,
  RepoMap,
  RepoMapSchema,
  ResonanceOut,
  ResonanceOutSchema
} from './types.js';

type ToolArgs = Record<string, unknown> | undefined;

type ToolData = Record<string, unknown>;

const server = new McpServer({
  name: 'mandala-mcp',
  version: '0.1.0'
});

const limiter = new ToolRateLimiter({
  health: { limit: 20, intervalMs: 10_000 },
  get_kpi_list: { limit: 6, intervalMs: 60_000 },
  get_crep_resonance: { limit: 6, intervalMs: 60_000 },
  query_repo_map: { limit: 3, intervalMs: 30_000 }
});

const audit = new AuditLogger();

function toToolResult<T extends ToolData>(data: T) {
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(data, null, 2)
      }
    ],
    structuredContent: data
  };
}

function withAudit<T extends ToolArgs, R extends ToolData>(tool: string, handler: (args: T) => Promise<R> | R) {
  return async (args: T) => {
    const started = Date.now();
    const paramsHash = hashObject(args ?? {});
    if (!limiter.allow(tool)) {
      const error = createError('rate_limited');
      audit.write({
        ts: new Date().toISOString(),
        tool,
        ok: false,
        ms: 0,
        paramsHash,
        error: error.message,
        meta: { code: 'rate_limited' }
      });
      throw error;
    }
    try {
      const data = await handler(args);
      audit.write({
        ts: new Date().toISOString(),
        tool,
        ok: true,
        ms: Date.now() - started,
        paramsHash
      });
      return toToolResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      audit.write({
        ts: new Date().toISOString(),
        tool,
        ok: false,
        ms: Date.now() - started,
        paramsHash,
        error: message
      });
      throw err;
    }
  };
}

server.registerTool('health', {
  description: 'Health check for the Mandala MCP server',
  inputSchema: {},
  outputSchema: HealthSchema.shape
}, withAudit('health', async () => health()));

server.registerTool('get_kpi_list', {
  description: 'Gibt die aktuelle KPI-Liste (Dashboard) zurück. Quelle: Mandala API oder lokale Demo-Daten.',
  inputSchema: {},
  outputSchema: KpiListSchema.shape
}, withAudit('get_kpi_list', async () => await loadKpiList()));

server.registerTool('get_crep_resonance', {
  description: 'Liefert aktuelle CREP-Resonanz (0..1). Quelle: Mandala API oder lokale Demo-Daten.',
  inputSchema: {},
  outputSchema: ResonanceOutSchema.shape
}, withAudit('get_crep_resonance', async () => await loadResonance()));

server.registerTool('query_repo_map', {
  description: 'Liest RepoMap aus docs/RepoMap.(yaml|json) oder analysis/repo-map.json und liefert eine strukturierte Übersicht.',
  inputSchema: {},
  outputSchema: RepoMapSchema.shape
}, withAudit('query_repo_map', async () => loadRepoMap()));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Mandala MCP server connected via stdio');
}

main().catch((err) => {
  console.error('Mandala MCP server failed', err);
  process.exit(1);
});
