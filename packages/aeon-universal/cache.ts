import crypto from 'crypto';
import { CompileResult } from './compiler';

class CompileCache {
  private cache = new Map<string, CompileResult>();

  get(key: string): CompileResult | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: CompileResult): void {
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const compileCache = new CompileCache();

export function hashSource(source: string): string {
  return crypto.createHash('sha256').update(source).digest('hex');
}
