import express from 'express';
import { GraphDBPersistence } from '../GraphDBPersistence';

export function createRuleRegistryService(persistence = new GraphDBPersistence()) {
  const app = express();
  app.use(express.json());

  app.post('/rules', async (req, res) => {
    await persistence.saveRule(req.body);
    res.status(201).end();
  });

  app.get('/rules', async (_req, res) => {
    res.json(await persistence.getRules());
  });

  return app;
}
