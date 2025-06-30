import express from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

interface JwtUser {
  id: string;
}

const router = express.Router();
const limiter = rateLimit({ windowMs: 60_000, max: 10 });

function auth(secret: string) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const header = req.header('Authorization');
    if (!header) return res.status(401).json({ error: 'Missing token' });
    const token = header.replace(/^Bearer\s+/i, '');
    try {
      const payload = jwt.verify(token, secret) as JwtUser;
      (req as any).user = payload;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}

let store: { haiku: string; delta: number; ts: number }[] = [];

export default function haikuRoutes(secret: string) {
  router.post('/vote', auth(secret), limiter, express.json(), (req, res) => {
    const { haiku, delta } = req.body;
    store.push({ haiku, delta, ts: Date.now() });
    res.sendStatus(204);
  });

  router.get('/votes', auth(secret), (_req, res) => {
    res.json(store);
  });

  return router;
}
