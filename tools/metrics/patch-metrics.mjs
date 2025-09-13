import http from 'http';
import { ensureDefaultMetrics, REG } from '../../src/metrics/singleton.cjs';

ensureDefaultMetrics();

const server = http.createServer(async (req, res) => {
  if (req.url === '/metrics') {
    res.setHeader('Content-Type', REG.contentType);
    res.end(await REG.metrics());
  } else {
    res.statusCode = 404;
    res.end('not found');
  }
});

const port = process.env.PORT || 9100;
server.listen(port, () => {
  console.log(`Metrics server listening on ${port}`);
});
