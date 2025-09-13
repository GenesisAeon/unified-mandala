import { collectDefaultMetrics } from 'prom-client';
import { Request, Response, NextFunction } from 'express';
import {
  REG,
  getOrCreateCounter,
  getOrCreateHistogram,
  metricsText,
} from '../../../src/metrics/singleton';

collectDefaultMetrics({ register: REG });

const httpRequestCounter = getOrCreateCounter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'] as const,
});

const httpRequestDuration = getOrCreateHistogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'] as const,
});

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const end = httpRequestDuration.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => {
    const status = res.statusCode;
    httpRequestCounter.labels(req.method, req.path, String(status)).inc();
    end({ status: String(status) });
  });
  next();
}

export function metricsEndpoint(_req: Request, res: Response) {
  res.set('Content-Type', REG.contentType);
  metricsText().then(m => res.end(m));
}
