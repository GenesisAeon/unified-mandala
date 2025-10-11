import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface AgentEntry {
  id: string;
  description?: string;
  start?: string;
  capabilities?: Record<string, unknown>;
  ethical_guardrails?: boolean;
}

export interface WorkflowEvents {
  loaded: { count: number };
  start: { dryRun: boolean };
  'agent:dry-run': AgentEntry;
  'agent:start': AgentEntry;
  'agent:started': AgentEntry;
  finished: { count: number };
}

export default class AgentWorkflowEngine extends EventEmitter {
  private agents: AgentEntry[] = [];
  constructor(private registryPath: string = path.resolve('agents.yaml')) {
    super();
  }

  /** Load agents from YAML registry and emit a loaded event. */
  loadAgents(): void {
    const raw = fs.readFileSync(this.registryPath, 'utf8');
    const data = yaml.load(raw) as { agents?: AgentEntry[] };
    const sourceAgents = Array.isArray(data?.agents) ? data.agents : [];
    this.agents = sourceAgents.map((agent) => ({
      ...agent,
      ethical_guardrails: agent?.ethical_guardrails ?? true,
    }));
    this.emit('loaded', { count: this.agents.length });
  }

  /** Return lightweight snapshot of loaded agents. */
  snapshot(): AgentEntry[] {
    return this.agents.map((a) => ({
      id: a.id,
      start: a.start,
      description: a.description,
      capabilities: a.capabilities,
      ethical_guardrails: a.ethical_guardrails ?? true,
    }));
  }

  /** Iterate through agents and emit lifecycle events. */
  async start(dryRun = false): Promise<void> {
    this.emit('start', { dryRun });
    for (const agent of this.agents) {
      if (dryRun) {
        this.emit('agent:dry-run', agent);
        continue;
      }
      this.emit('agent:start', agent);
      // Placeholder for actual boot logic
      this.emit('agent:started', agent);
    }
    this.emit('finished', { count: this.agents.length });
  }
}
