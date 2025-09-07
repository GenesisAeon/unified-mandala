import { collectDefaultMetrics, register } from 'prom-client';
import http from 'http';

collectDefaultMetrics();

const server = http.createServer(async (req, res) => {
  if (req.url === '/metrics') {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
  } else {
    res.statusCode = 404;
    res.end('not found');
  }
});

const port = process.env.PORT || 9100;
server.listen(port, () => {
  console.log(`Metrics server listening on ${port}`);
});
