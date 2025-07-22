export interface Relation {
  from: string;
  to: string;
  type: string;
}

export class PantheonKnowledgeGraph {
  private edges: Relation[] = [];

  addRelation(rel: Relation) {
    this.edges.push(rel);
  }

  getRelations() {
    return [...this.edges];
  }
}
