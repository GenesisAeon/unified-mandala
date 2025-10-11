import { describe, it, expect } from 'vitest';
import { PantheonKnowledgeGraph } from './PantheonKnowledgeGraph';

describe('PantheonKnowledgeGraph', () => {
  it('stores relations', () => {
    const g = new PantheonKnowledgeGraph();
    g.addRelation({ from: 'a', to: 'b', type: 'link' });
    expect(g.getRelations()).toHaveLength(1);
  });
});
