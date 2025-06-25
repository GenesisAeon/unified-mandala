import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { CompileResult } from './compiler';

class CompileCache {
  private cache = new Map<string, CompileResult>();
  private persistent = process.env.AEON_PERSIST_CACHE === '1';
  private cacheDir = path.resolve('.aeoncache');

  setPersistent(enabled: boolean) {
    this.persistent = enabled;
    if (this.persistent) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private filePath(key: string): string {
    return path.join(this.cacheDir, `${key}.json`);
  }

  get(key: string): CompileResult | undefined {
    const mem = this.cache.get(key);
    if (mem) return mem;
    if (this.persistent) {
      const file = this.filePath(key);
      if (fs.existsSync(file)) {
        const data = JSON.parse(fs.readFileSync(file, 'utf8')) as CompileResult;
        this.cache.set(key, data);
        return data;
      }
    }
    return undefined;
  }

  set(key: string, value: CompileResult): void {
    this.cache.set(key, value);
    if (this.persistent) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
      fs.writeFileSync(this.filePath(key), JSON.stringify(value));
    }
  }

  clear(): void {
    this.cache.clear();
    if (this.persistent && fs.existsSync(this.cacheDir)) {
      for (const f of fs.readdirSync(this.cacheDir)) {
        fs.unlinkSync(path.join(this.cacheDir, f));
      }
    }
  }
}

export const compileCache = new CompileCache();

export function hashSource(source: string): string {
  return crypto.createHash('sha256').update(source).digest('hex');
}
