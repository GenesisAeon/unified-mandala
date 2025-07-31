import express from 'express';
import { CREPManager } from './CREPManager';

export function createCREPFeedbackAPI(manager: CREPManager) {
  const app = express();
  app.use(express.json());

  app.get('/crep-feedback', (_req, res) => {
    res.json(manager.getAverageCREP());
  });

  app.post('/crep-feedback', (req, res) => {
    const { C, R, E, P } = req.body || {};
    if ([C, R, E, P].some(v => typeof v !== 'number')) {
      return res.status(400).json({ error: 'invalid data' });
    }
    manager.addCREPEntry(C, R, E, P);
    res.status(201).json({ success: true });
  });

  return app;
}
