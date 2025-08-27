export async function withRetry<T>(fn:()=>Promise<T>, attempts:number, baseDelayMs:number, jitter=true): Promise<T> {
  let err: any;
  for (let i=0;i<attempts;i++) {
    try { return await fn(); } catch(e){ err = e; }
    const backoff = baseDelayMs * Math.pow(2, i);
    const j = jitter ? Math.random() * backoff * 0.2 : 0;
    await new Promise(r=>setTimeout(r, backoff + j));
  }
  throw err;
}

