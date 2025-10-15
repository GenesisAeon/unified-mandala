declare module '@mandala/boundary-core' {
  type ReactNode = import('react').ReactNode;
  export type BoundaryVerdict = 'pass' | 'violation' | 'resolve' | 'warn' | 'error' | string;
  export type BoundarySeverity = 'info' | 'ok' | 'warn' | 'error' | string;
  export type BoundaryObservation = {
    ts: string | number | Date;
    source?: string;
    ruleId?: string;
    verdict: BoundaryVerdict;
    severity?: BoundarySeverity;
    details?: string | number | boolean | ReactNode | null;
  };
  export type BoundaryRule = {
    id?: string;
    pattern?: string;
    severity?: BoundarySeverity;
    [key: string]: unknown;
  };
  export default class BoundaryRegistry {
    constructor(...args: any[]);
    registerMany(rules: BoundaryRule[]): void;
    list(): BoundaryRule[];
  }
}

declare module '@mandala/boundary-engine' {
  export default class DiscoveryEngine {
    constructor(...args: any[]);
    loadRules(rules: any[]): void;
    run(inputs: any): Promise<any> | any;
  }
}
