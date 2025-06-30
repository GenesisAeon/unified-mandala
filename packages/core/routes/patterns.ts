import express from 'express';
import fs from 'fs';
import path from 'path';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

export interface JwtUser {
  id: string;
}

const router = express.Router();
const PATTERN_FILE = path.join(__dirname, '../../../plugins/mandalaHaiku/customPatterns.json');

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

const limiter = rateLimit({ windowMs: 60_000, max: 5 });

export default function patternRoutes(secret: string) {
  router.get('/', auth(secret), limiter, (_req, res) => {
    const data = fs.existsSync(PATTERN_FILE)
      ? JSON.parse(fs.readFileSync(PATTERN_FILE, 'utf8'))
      : [];
    res.json(data);
  });

  router.post('/', auth(secret), limiter, express.json(), (req, res) => {
    const { pattern } = req.body;
    if (typeof pattern !== 'string' || pattern.length < 10) {
      return res.status(400).json({ error: 'Pattern must be a non-empty string' });
    }
    const list = fs.existsSync(PATTERN_FILE)
      ? JSON.parse(fs.readFileSync(PATTERN_FILE, 'utf8'))
      : [];
    list.push(pattern);
    fs.writeFileSync(PATTERN_FILE, JSON.stringify(list, null, 2), 'utf8');
    res.status(201).json({ message: 'Pattern added' });
  });

  return router;
}
