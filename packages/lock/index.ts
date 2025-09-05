import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { Redis } from "ioredis";

export async function cleanupStaleLocks(maxAgeMs = 5*60*1000) {
  const dir = path.resolve(".locks");
  if (!fs.existsSync(dir)) return;
  const now = Date.now();
  for (const entry of fs.readdirSync(dir)) {
    const kdir = path.join(dir, entry);
    try {
      const st = fs.statSync(kdir);
      if (now - st.mtimeMs > maxAgeMs) await fsp.rm(kdir, { recursive: true, force: true });
    } catch {}
  }
}
export interface ILock {
  acquire(key: string, ttlMs?: number): Promise<string>;
  release(key: string, token: string): Promise<void>;
  withLock<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T>;
}
export class RedisLock implements ILock {
  constructor(private redis: Redis) {}
  async acquire(key: string, ttlMs = 30000) {
    const lockKey = `lock:${key}`; const token = randomUUID();
    const ok = await this.redis.set(lockKey, token, "PX", ttlMs, "NX");
    if (!ok) throw new Error("lock_exists");
    return token;
  }
  async release(key: string, token: string) {
    const lockKey = `lock:${key}`;
    const lua = `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
      else
        return 0
      end
    `;
    await this.redis.eval(lua, 1, lockKey, token);
  }
  async withLock<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
    const t = await this.acquire(key, ttlMs);
    try { return await fn(); } finally { await this.release(key, t); }
  }
}
export class FsLock implements ILock {
  private dir = path.resolve(".locks");
  constructor() { if (!fs.existsSync(this.dir)) fs.mkdirSync(this.dir, { recursive: true }); }
  async acquire(key: string, ttlMs = 30000) {
    const token = randomUUID(); const kdir = path.join(this.dir, encodeURIComponent(key));
    await fsp.mkdir(kdir).catch((e:any)=>{ if(e.code==="EEXIST") throw new Error("lock_exists"); else throw e; });
    await fsp.writeFile(path.join(kdir,"token"), token, "utf8");
    setTimeout(() => this.release(key, token).catch(()=>{}), ttlMs).unref?.();
    return token;
  }
  async release(key: string, token: string) {
    const kdir = path.join(this.dir, encodeURIComponent(key));
    const tPath = path.join(kdir, "token");
    let onDisk = "";
    try { onDisk = await fsp.readFile(tPath, "utf8"); } catch {}
    if (onDisk.trim() !== token.trim()) return;
    await fsp.rm(kdir, { recursive: true, force: true });
  }
  async withLock<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
    const t = await this.acquire(key, ttlMs);
    try { return await fn(); } finally { await this.release(key, t); }
  }
}
export function makeLock(redis?: any): ILock {
  return redis ? new RedisLock(redis) : new FsLock();
}
