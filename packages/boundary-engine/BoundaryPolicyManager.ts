export interface Policy {
  id: string;
  rules: string[];
}

export class BoundaryPolicyManager {
  private policies = new Map<string, Policy>();

  add(policy: Policy): void {
    this.policies.set(policy.id, policy);
  }

  remove(id: string): void {
    this.policies.delete(id);
  }

  get(id: string): Policy | undefined {
    return this.policies.get(id);
  }

  list(): Policy[] {
    return Array.from(this.policies.values());
  }
}
