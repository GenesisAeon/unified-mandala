// eslint-disable-next-line @typescript-eslint/no-var-requires
const CircuitBreaker = require('opossum');

export function withCircuit<T extends (...args: any[]) => Promise<any>>(fn: T, opts: any = {}): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  const breaker = new CircuitBreaker(fn, opts);
  return (...args: Parameters<T>) => breaker.fire(...args) as Promise<ReturnType<T>>;
}
