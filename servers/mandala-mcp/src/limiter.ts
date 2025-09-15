type ToolLimitConfig = {
  limit: number;
  intervalMs: number;
};

type ToolWindow = {
  count: number;
  resetAt: number;
};

export class ToolRateLimiter {
  private windows = new Map<string, ToolWindow>();

  constructor(private readonly config: Record<string, ToolLimitConfig>) {}

  allow(tool: string): boolean {
    const limits = this.config[tool];
    if (!limits) return true;
    const now = Date.now();
    const window = this.windows.get(tool);
    if (!window || now >= window.resetAt) {
      this.windows.set(tool, { count: 1, resetAt: now + limits.intervalMs });
      return true;
    }
    if (window.count >= limits.limit) {
      return false;
    }
    window.count += 1;
    return true;
  }
}
