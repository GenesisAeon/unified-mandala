import { HealthInfo } from '../types.js';

export function health(): HealthInfo {
  return {
    status: 'ok',
    ts: new Date().toISOString(),
    version: '0.1.0',
    node: process.version,
    pid: process.pid
  };
}
