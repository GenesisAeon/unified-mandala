export type AgentHealth = { id: string; ok: boolean; info?: Record<string, unknown> };
export type AgentContext = {
  logger: (level: 'debug' | 'info' | 'warn' | 'error', msg: string, meta?: any) => void;
  rateLimit: (key?: string) => Promise<void>;
  http: (url: string, init?: RequestInit & { timeoutMs?: number }) => Promise<Response>;
  guard: {
    ensureAllowedDomain: (url: string) => void;
    consentRequired: boolean;
    requestTimeoutMs: number;
  };
};
export interface Agent<Input = any, Output = any> {
  id: string;
  health(): Promise<AgentHealth>;
  run(input: Input, ctx: AgentContext): Promise<Output>;
  getCapabilities?(): Promise<string[]>;
}
