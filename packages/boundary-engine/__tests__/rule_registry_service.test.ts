import request from 'supertest';
import { createRuleRegistryService } from '../rule_registry_service/registry_api';
import { GraphDBPersistence } from '../GraphDBPersistence';

describe('rule_registry_service', () => {
  it('stores and retrieves rules', async () => {
    const app = createRuleRegistryService(new GraphDBPersistence());
    await request(app).post('/rules').send({ id: '1' });
    const res = await request(app).get('/rules');
    expect(res.body).toHaveLength(1);
  });
});
