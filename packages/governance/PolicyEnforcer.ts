import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

export type PolicyType = 'tools' | 'models' | 'subjects';

interface AgentPolicy {
  tools?: string[];
  models?: string[];
  subjects?: string[];
}

interface PermissionsFile {
  agents?: Record<string, AgentPolicy>;
}

export class PolicyEnforcer {
  private policies: Record<string, AgentPolicy>;

  constructor(permissionsPath: string = path.resolve(process.cwd(), 'governance/permissions.yaml')) {
    const raw = fs.readFileSync(permissionsPath, 'utf8');
    const parsed: PermissionsFile = YAML.parse(raw) || {};
    this.policies = parsed.agents || {};
  }

  isAllowed(agent: string, type: PolicyType, name: string): boolean {
    const policy = this.policies[agent];
    if (!policy) return false;
    const list = policy[type] || [];
    return list.includes(name);
  }

  enforce(agent: string, type: PolicyType, name: string): void {
    if (!this.isAllowed(agent, type, name)) {
      throw new Error(`${agent} not permitted to use ${type}: ${name}`);
    }
  }
}

export default PolicyEnforcer;
