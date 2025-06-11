export interface AgentConfig {
  name: string;
  simulate: () => void;
}

export function runDryAgent(agent: AgentConfig): string[] {
  const log: string[] = [];
  try {
    agent.simulate();
    log.push(`Agent ${agent.name} passed dry-check.`);
  } catch (e: any) {
    log.push(`❌ Agent ${agent.name} failed: ${e.message}`);
  }
  return log;
}
