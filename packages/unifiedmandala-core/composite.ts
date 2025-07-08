export interface CompositeNode {
  name: string;
  children: CompositeNode[];
  add(child: CompositeNode): void;
}

export class BaseNode implements CompositeNode {
  children: CompositeNode[] = [];
  constructor(public name: string) {}
  add(child: CompositeNode): void {
    this.children.push(child);
  }
}
