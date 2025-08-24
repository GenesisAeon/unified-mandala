export interface Refusal {
  reason: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: string;
}

/**
 * RefusalEngine generates structured refusal objects
 * that can be logged or returned to clients.
 */
export class RefusalEngine {
  static create(reason: string, code?: string, details?: Record<string, any>): Refusal {
    return {
      reason,
      code,
      details,
      timestamp: new Date().toISOString()
    };
  }
}

export default RefusalEngine;
