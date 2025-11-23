type Span = {
  spanContext: () => { spanId: string; traceId: string };
  end: () => void;
};

type Counter = {
  adds: Array<{ value: number; attributes?: Record<string, unknown> }>;
  add: (value: number, attributes?: Record<string, unknown>) => void;
};

type Histogram = {
  records: Array<{ value: number; attributes?: Record<string, unknown> }>;
  record: (value: number, attributes?: Record<string, unknown>) => void;
};

type ObservableGauge = {
  callbacks: Set<(observable: { observe: (value: number) => void }) => void>;
  addCallback: (cb: (observable: { observe: (value: number) => void }) => void) => void;
  removeCallback: (cb: (observable: { observe: (value: number) => void }) => void) => void;
};

type Meter = {
  createHistogram: (name: string, _options?: Record<string, unknown>) => Histogram;
  createCounter: (name: string, _options?: Record<string, unknown>) => Counter;
  createUpDownCounter: (name: string, _options?: Record<string, unknown>) => Counter;
  createObservableGauge: (name: string, _options?: Record<string, unknown>) => ObservableGauge;
};

const makeCounter = (): Counter => ({
  adds: [],
  add(value, attributes) {
    this.adds.push({ value, attributes });
  },
});

const makeHistogram = (): Histogram => ({
  records: [],
  record(value, attributes) {
    this.records.push({ value, attributes });
  },
});

const makeObservableGauge = (): ObservableGauge => ({
  callbacks: new Set(),
  addCallback(cb) {
    this.callbacks.add(cb);
  },
  removeCallback(cb) {
    this.callbacks.delete(cb);
  },
});

const meters = new Map<string, Meter>();
const createMeter = (): Meter => ({
  createHistogram: () => makeHistogram(),
  createCounter: () => makeCounter(),
  createUpDownCounter: () => makeCounter(),
  createObservableGauge: () => makeObservableGauge(),
});

let activeSpan: Span | undefined;

const createSpan = (): Span => ({
  spanContext: () => ({
    spanId: 'stub-span',
    traceId: 'stub-trace',
  }),
  end: () => {},
});

let currentContext: { span?: Span } = {};

export const context = {
  active: () => currentContext,
  with: (ctx: { span?: Span } | undefined, fn: (...args: any[]) => unknown, ...args: any[]) => {
    const previous = currentContext;
    currentContext = ctx ?? previous ?? {};
    try {
      return fn(...args);
    } finally {
      currentContext = previous;
    }
  },
};

export const propagation = {
  getBaggage: () => undefined,
  setBaggage: (ctx: unknown) => ctx,
  createBaggage: () => ({
    getEntry: () => undefined,
  }),
};

export const trace = {
  getTracer: () => ({
    startSpan: () => {
      activeSpan = createSpan();
      currentContext = { ...(currentContext ?? {}), span: activeSpan };
      return activeSpan;
    },
    startActiveSpan: (_name: unknown, optionsOrFn: any, contextOrFn?: any, maybeFn?: any) => {
      let fn: (...args: any[]) => unknown;
      if (typeof optionsOrFn === 'function') {
        fn = optionsOrFn;
      } else if (typeof contextOrFn === 'function') {
        fn = contextOrFn;
      } else {
        fn = typeof maybeFn === 'function' ? maybeFn : () => {};
      }
      const span = createSpan();
      const prev = activeSpan;
      activeSpan = span;
      const previousContext = currentContext;
      currentContext = { ...(currentContext ?? {}), span };
      try {
        return fn(span);
      } finally {
        activeSpan = prev;
        currentContext = previousContext;
      }
    },
  }),
  getSpan: (ctx?: { span?: Span }) => ctx?.span ?? activeSpan,
};

class ConsoleLogger {
  debug(..._args: unknown[]) {}
  verbose(..._args: unknown[]) {}
  info(..._args: unknown[]) {}
  warn(..._args: unknown[]) {}
  error(..._args: unknown[]) {}
}

export const DiagLogLevel = {
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  VERBOSE: 5,
  ALL: 6,
} as const;

export class DiagConsoleLogger extends ConsoleLogger {}

const noop = () => {};
let diagLogger: ConsoleLogger = new ConsoleLogger();

export const diag = {
  setLogger: (logger: ConsoleLogger, _level?: number) => {
    diagLogger = logger;
  },
  createComponentLogger: () => diagLogger,
  debug: (...args: unknown[]) => diagLogger.debug(...args),
  verbose: (...args: unknown[]) => diagLogger.verbose(...args),
  info: (...args: unknown[]) => diagLogger.info(...args),
  warn: (...args: unknown[]) => diagLogger.warn(...args),
  error: (...args: unknown[]) => diagLogger.error(...args),
};

export const metrics = {
  getMeter: (name: string): Meter => {
    if (!meters.has(name)) {
      meters.set(name, createMeter());
    }
    return meters.get(name)!;
  },
  getMeterProvider: () => ({ getMeter: (name: string) => metrics.getMeter(name) }),
  setGlobalMeterProvider: () => {},
  isMeterProvider: () => true,
};

export default {
  context,
  propagation,
  trace,
  diag,
  metrics,
  DiagConsoleLogger,
  DiagLogLevel,
};
