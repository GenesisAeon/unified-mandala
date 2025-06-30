import { collectDefaultMetrics, Counter, Histogram, register } from 'prom-client';
import { Request, Response, NextFunction } from 'express';

collectDefaultMetrics();

const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'] as const,
});

const httpRequestDuration = new Histogram({
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
  res.set('Content-Type', register.contentType);
  register.metrics().then(m => res.end(m));
}
