import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { createBrotliCompress, createGzip, constants as zlibConstants } from 'node:zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../apps/ui/dist');

const app = express();
app.disable('x-powered-by');

const ensureVaryAcceptEncoding = (res) => {
  const existing = res.getHeader('Vary');
  if (!existing) {
    res.setHeader('Vary', 'Accept-Encoding');
    return;
  }
  const normalized = Array.isArray(existing) ? existing.join(', ') : String(existing);
  if (!normalized.toLowerCase().includes('accept-encoding')) {
    res.setHeader('Vary', `${normalized}, Accept-Encoding`);
  }
};

const setCacheHeaders = (res, relativePath) => {
  const normalized = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  const isIndex = normalized === 'index.html';
  res.setHeader(
    'Cache-Control',
    isIndex ? 'public, max-age=0, must-revalidate' : 'public, max-age=31536000, immutable',
  );
};

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] ?? '';
  if (!acceptEncoding) {
    return next();
  }

  ensureVaryAcceptEncoding(res);

  const relativePath = req.path === '/' ? '/index.html' : req.path;
  const basePath = path.join(distDir, relativePath);

  const sendIfExists = (candidatePath, encoding) => {
    if (!fs.existsSync(candidatePath)) {
      return false;
    }
    res.type(path.basename(relativePath));
    setCacheHeaders(res, relativePath);
    if (encoding) {
      res.setHeader('Content-Encoding', encoding);
    }
    res.sendFile(candidatePath, (err) => {
      if (err) {
        next(err);
      }
    });
    return true;
  };

  const streamCompressed = (encoding) => {
    if (!fs.existsSync(basePath)) {
      return false;
    }
    const compressor =
      encoding === 'br'
        ? createBrotliCompress({
            params: {
              [zlibConstants.BROTLI_PARAM_QUALITY]: 5,
            },
          })
        : createGzip({ level: zlibConstants.Z_BEST_SPEED });
    res.type(path.basename(relativePath));
    setCacheHeaders(res, relativePath);
    res.setHeader('Content-Encoding', encoding);
    pipeline(fs.createReadStream(basePath), compressor, res, (err) => {
      if (err) {
        next(err);
      }
    });
    return true;
  };

  if (acceptEncoding.includes('br')) {
    if (sendIfExists(`${basePath}.br`, 'br') || streamCompressed('br')) {
      return;
    }
  }

  if (acceptEncoding.includes('gzip')) {
    if (sendIfExists(`${basePath}.gz`, 'gzip') || streamCompressed('gzip')) {
      return;
    }
  }

  next();
});

app.use(
  express.static(distDir, {
    extensions: ['html'],
    setHeaders(res, servedPath) {
      ensureVaryAcceptEncoding(res);
      const normalizedPath = servedPath.replace(/\.(br|gz)$/u, '');
      res.type(normalizedPath);
      const relative = path.relative(distDir, normalizedPath);
      setCacheHeaders(res, `/${relative}`);
      if (servedPath.endsWith('.br')) {
        res.setHeader('Content-Encoding', 'br');
      } else if (servedPath.endsWith('.gz')) {
        res.setHeader('Content-Encoding', 'gzip');
      }
    },
  }),
);

app.get('*', (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }
  const acceptsHtml = (req.headers.accept ?? '').includes('text/html');
  if (!acceptsHtml) {
    return next();
  }

  const served = path.join(distDir, 'index.html');
  if (!fs.existsSync(served)) {
    return next();
  }

  const acceptEncoding = req.headers['accept-encoding'] ?? '';
  ensureVaryAcceptEncoding(res);
  setCacheHeaders(res, '/index.html');

  const trySend = (extension, encoding) => {
    const candidate = `${served}${extension}`;
    if (!fs.existsSync(candidate)) {
      return false;
    }
    res.type('text/html');
    res.setHeader('Content-Encoding', encoding);
    res.sendFile(candidate, (err) => {
      if (err) {
        next(err);
      }
    });
    return true;
  };

  const streamIndex = (encoding) => {
    if (!fs.existsSync(served)) {
      return false;
    }
    const compressor =
      encoding === 'br'
        ? createBrotliCompress({
            params: {
              [zlibConstants.BROTLI_PARAM_QUALITY]: 5,
            },
          })
        : createGzip({ level: zlibConstants.Z_BEST_SPEED });
    res.type('text/html');
    res.setHeader('Content-Encoding', encoding);
    setCacheHeaders(res, '/index.html');
    pipeline(fs.createReadStream(served), compressor, res, (err) => {
      if (err) {
        next(err);
      }
    });
    return true;
  };

  if (acceptEncoding.includes('br') && (trySend('.br', 'br') || streamIndex('br'))) {
    return;
  }

  if (acceptEncoding.includes('gzip') && (trySend('.gz', 'gzip') || streamIndex('gzip'))) {
    return;
  }

  res.type('text/html');
  res.sendFile(served, (err) => {
    if (err) {
      next(err);
    }
  });
});

const parsedPort = Number.parseInt(process.env.PORT ?? '', 10);
const port = Number.isNaN(parsedPort) ? 3000 : parsedPort;

const server = app.listen(port, () => {
  const address = server.address();
  const actualPort = typeof address === 'object' && address !== null ? address.port : port;
  console.log(`[light-static-server] listening on http://127.0.0.1:${actualPort}`);
});

const shutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
